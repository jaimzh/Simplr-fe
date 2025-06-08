
window.fetchDefinition = async function (word) {
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
    word
  )}`;
  const res = await fetch(url);
  const data = await res.json();
  const entry = Array.isArray(data) && data[0];
  const meaning = entry?.meanings?.[0];
  const defObj = meaning?.definitions?.[0] || {};
  return {
    pronunciation: entry?.phonetics?.[0]?.text || "",
    partOfSpeech: meaning?.partOfSpeech || "",
    definition: defObj.definition || "No definition found.",
    example: defObj.example || "",
  };
};

window.simplifyText = async function (text) {
  const url =
    "https://simplr-ai-be.my-first-cloudflare-worker.workers.dev/simplify";

  try {
    console.log("🔍 simplifyText: sending text to backend:", text);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    console.log("📡 simplifyText: response status:", res.status);

    if (!res.ok) {
      throw new Error(`API error ${res.status}`);
    }

    const fullResponse = await res.json();
    console.log("📦 simplifyText: full response JSON:", fullResponse);

    const simplified = fullResponse?.response || "No simplified text found";
    console.log("✅ simplifyText: simplified output:", simplified);

    return simplified;
  } catch (error) {
    console.error("❌ simplifyText error:", error);
    return "Error simplifying";
  }
};
