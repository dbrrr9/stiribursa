import "dotenv/config";
import OpenAI from "openai";

const key = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: key });

const sys = "Esti un bot";
const prompt = "Testeaza-ma";
const jsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hello: { type: "string" }
  },
  required: ["hello"]
};

async function test() {
  const messages: any[] = [
    { role: "system", content: sys },
    { role: "user", content: prompt }
  ];

  messages[0].content += "\n\nCRITICAL: You MUST reply with ONLY a valid JSON object. Ensure you follow this exact JSON schema:\n" + JSON.stringify(jsonSchema);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    max_tokens: 100,
    response_format: { type: "json_object" },
  });

  console.log(response.choices[0].message.content);
}
test().catch(console.error);
