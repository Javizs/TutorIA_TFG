"use client";

import { useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { scenarios } from "@/lib/tutor/config/scenarios";
import type { TutorScenario } from "@/lib/tutor/config/scenarios";
import type { Message, FeedbackResult } from "@/lib/tutor/types";
import { getLessonPlan, type LessonPlan } from "@/lib/tutor/utils/getLessonPlan";
import { useSearchParams } from "next/navigation";

const MAX_USER_MESSAGES = 5;

export default function TestTutorPage() {
  const searchParams = useSearchParams();
  const level = searchParams.get("level");

  if (!level) {
    return (
      <div className="min-h-screen bg-background text-text flex items-center justify-center">
        <p className="text-text-soft">Error: No se ha seleccionado un nivel válido.</p>
      </div>
    );
  }

  const [selectedScenario, setSelectedScenario] = useState<TutorScenario>(scenarios[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const [isSessionFinished, setIsSessionFinished] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const userMessageCount = messages.filter((message) => message.role === "user").length;
  const sessionLimitReached = userMessageCount >= MAX_USER_MESSAGES;

  function handleStartScenario(scenario: TutorScenario) {
    const newLessonPlan = getLessonPlan(scenario);

    setSelectedScenario(scenario);
    setLessonPlan(newLessonPlan);
    setFeedback(null);
    setIsSessionFinished(false);
    setInputValue("");

    setMessages([
      {
        role: "tutor",
        content: newLessonPlan.introduction,
      },
      {
        role: "tutor",
        content: newLessonPlan.questions[0],
      },
    ]);
  }

  async function playTutorAudio(text: string) {
    try {
      const response = await fetch("/api/speak", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Error generating speech");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }

      const audio = new Audio(audioUrl);
      audioPlayerRef.current = audio;
      audio.play();
    } catch (error) {
      console.error("Audio playback error:", error);
    }
  }

  async function sendMessage(messageText: string) {
    const trimmedValue = messageText.trim();

    if (
      !trimmedValue ||
      isLoading ||
      !lessonPlan ||
      isSessionFinished ||
      sessionLimitReached
    ) {
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: trimmedValue,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scenario: selectedScenario,
          messages: updatedMessages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error generating tutor response.");
      }

      const tutorReply: Message = {
        role: "tutor",
        content: data.reply,
      };

      setMessages((prevMessages) => [...prevMessages, tutorReply]);
    } catch (error) {
      console.error("Send message error:", error);

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "tutor",
          content: "There was an error generating the response.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSendMessage() {
    await sendMessage(inputValue);
  }

  async function handleGenerateFeedback() {
    if (!lessonPlan || messages.length === 0) return;

    setIsLoading(true);
    setIsSessionFinished(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scenario: selectedScenario,
          messages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error generating feedback.");
      }

      setFeedback(data.feedback);
    } catch (error) {
      console.error("Feedback error:", error);

      setFeedback({
        positivePoints: [],
        thingsToImprove: ["The feedback could not be generated."],
        correctedExamples: [],
        finalRecommendation: "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleDownloadPdf() {
    if (!feedback || !lessonPlan) return;

    const doc = new jsPDF();
    let y = 20;

    const addWrappedText = (label: string, text: string, spacing = 8) => {
      const lines = doc.splitTextToSize(`${label}${text}`, 170);
      doc.text(lines, 20, y);
      y += lines.length * 7 + spacing;
    };

    const addSectionTitle = (title: string) => {
      doc.setFont("helvetica", "bold");
      doc.text(title, 20, y);
      y += 8;
      doc.setFont("helvetica", "normal");
    };

    const addBulletList = (items: string[]) => {
      items.forEach((item) => {
        const lines = doc.splitTextToSize(`• ${item}`, 165);
        doc.text(lines, 25, y);
        y += lines.length * 7 + 4;

        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });
    };

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("English Tutor Session Feedback", 20, y);
    y += 12;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    addWrappedText("Level: ", selectedScenario.level, 4);
    addWrappedText("Topic: ", lessonPlan.topic, 4);
    addWrappedText("Subtopic: ", lessonPlan.subtopic, 10);

    addSectionTitle("Positive points");
    addBulletList(feedback.positivePoints);

    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    addSectionTitle("Things to improve");
    addBulletList(feedback.thingsToImprove);

    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    addSectionTitle("Corrected examples");
    addBulletList(feedback.correctedExamples);

    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    addSectionTitle("Final recommendation");
    addWrappedText("", feedback.finalRecommendation, 8);

    doc.save("english-tutor-feedback.pdf");
  }

  async function startRecording() {
    try {
      if (isSessionFinished || sessionLimitReached) return;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioFile = new File([audioBlob], "recording.webm", {
          type: "audio/webm",
        });

        const formData = new FormData();
        formData.append("file", audioFile);

        try {
          setIsLoading(true);

          const response = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Error transcribing audio.");
          }

          setInputValue(data.text);
          await sendMessage(data.text);
        } catch (error) {
          console.error("Transcription error:", error);

          setMessages((prevMessages) => [
            ...prevMessages,
            {
              role: "tutor",
              content: "There was an error transcribing the audio.",
            },
          ]);
        } finally {
          setIsLoading(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Recording error:", error);
    }
  }

  function stopRecording() {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    setIsRecording(false);
  }

  return (
    <div className="min-h-screen bg-background text-text">
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-primary mb-2">Tutor</h1>
        <p className="text-text-soft mb-8">
          Tutor con texto, transcripción, audio y evaluación final.
        </p>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className={`bg-surface border rounded-md p-5 shadow-sm ${
                selectedScenario.id === scenario.id
                  ? "border-primary"
                  : "border-border"
              }`}
            >
              <p className="text-sm text-text-soft">{scenario.level}</p>
              <h2 className="text-lg font-semibold text-primary">
                {scenario.title}
              </h2>
              <p className="text-sm text-text-soft mt-2">
                {scenario.description}
              </p>

              <button
                onClick={() => handleStartScenario(scenario)}
                className="mt-4 bg-primary text-background px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
              >
                Start conversation
              </button>
            </div>
          ))}
        </section>

        {lessonPlan && (
          <section className="bg-surface border border-border rounded-md p-6 mb-8">
            <h3 className="text-xl font-semibold text-primary mb-3">
              Current lesson
            </h3>
            <p className="text-sm text-text-soft">
              <strong>Topic:</strong> {lessonPlan.topic}
            </p>
            <p className="text-sm text-text-soft">
              <strong>Subtopic:</strong> {lessonPlan.subtopic}
            </p>
            <p className="text-sm text-text-soft mt-2">
              <strong>User answers:</strong> {userMessageCount} / {MAX_USER_MESSAGES}
            </p>
          </section>
        )}

        <section className="bg-surface border border-border rounded-md p-6 mb-8">
          <h3 className="text-xl font-semibold text-primary mb-4">Chat test</h3>

          <div className="bg-background border border-border rounded-md p-4 min-h-[250px] mb-4 space-y-3">
            {messages.length === 0 ? (
              <p className="text-text-soft text-sm">
                Select a scenario to start.
              </p>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-md max-w-[80%] ${
                    message.role === "user"
                      ? "bg-primary text-background ml-auto"
                      : "bg-surface border border-border"
                  }`}
                >
                  <p className="font-semibold mb-1">
                    {message.role === "user" ? "You" : "Tutor"}
                  </p>

                  <p>{message.content}</p>

                  {message.role === "tutor" && (
                    <button
                      onClick={() => playTutorAudio(message.content)}
                      className="mt-2 text-sm bg-primary text-background px-3 py-1 rounded-md hover:bg-primary-dark transition-colors"
                    >
                      🔊 Play audio
                    </button>
                  )}
                </div>
              ))
            )}

            {isLoading && (
              <p className="text-sm text-text-soft">Tutor is thinking...</p>
            )}

            {sessionLimitReached && !feedback && (
              <p className="text-sm text-text-soft">
                Session limit reached. You can now generate the feedback.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 md:flex-row mb-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Write your message in English..."
              className="flex-1 border border-border rounded-md px-4 py-2 bg-background text-text"
            />

            <button
              onClick={handleSendMessage}
              disabled={
                isLoading || !lessonPlan || isSessionFinished || sessionLimitReached
              }
              className="bg-primary text-background px-4 py-2 rounded-md hover:bg-primary-dark transition-colors disabled:opacity-60"
            >
              Send
            </button>

            {!isRecording ? (
              <button
                onClick={startRecording}
                disabled={
                  isLoading || !lessonPlan || isSessionFinished || sessionLimitReached
                }
                className="bg-primary text-background px-4 py-2 rounded-md hover:bg-primary-dark transition-colors disabled:opacity-60"
              >
                Start recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="bg-primary text-background px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
              >
                Stop recording
              </button>
            )}

            <button
              onClick={handleGenerateFeedback}
              disabled={isLoading || !lessonPlan || messages.length === 0 || feedback !== null}
              className="bg-primary text-background px-4 py-2 rounded-md hover:bg-primary-dark transition-colors disabled:opacity-60"
            >
              Finish session
            </button>
          </div>
        </section>

        {feedback && (
          <section className="bg-surface border border-border rounded-md p-6">
            <h3 className="text-xl font-semibold text-primary mb-4">
              Session feedback
            </h3>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Positive points</h4>
              <ul className="list-disc pl-6 space-y-1 text-sm text-text-soft">
                {feedback.positivePoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Things to improve</h4>
              <ul className="list-disc pl-6 space-y-1 text-sm text-text-soft">
                {feedback.thingsToImprove.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Corrected examples</h4>
              <ul className="list-disc pl-6 space-y-1 text-sm text-text-soft">
                {feedback.correctedExamples.map((example, index) => (
                  <li key={index}>{example}</li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Final recommendation</h4>
              <p className="text-sm text-text-soft">
                {feedback.finalRecommendation}
              </p>
            </div>

            <button
              onClick={handleDownloadPdf}
              className="bg-primary text-background px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
            >
              Download PDF
            </button>
          </section>
        )}
      </div>
    </div>
  );
}