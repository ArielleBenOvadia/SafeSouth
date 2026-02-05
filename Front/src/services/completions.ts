import OpenAI from "openai";
import { Gender } from "../@Types";

export default async function completions(
  name: string,
  location: string,
  capacity: string,
  gender: Gender
) {
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  const genderInstruction =
    gender === "female"
      ? "נסחי את הטקסט בלשון נקבה (אני מעוניינת, אשמח לארח, מוזמנת ליצור קשר וכו׳)."
      : "נסח את הטקסט בלשון זכר (אני מעוניין, אשמח לארח, מוזמן ליצור קשר וכו׳).";

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "אתה עוזר לכתוב תוכן לפוסט על אירוח משפחות שפונו מביתן בשל מצב ביטחוני. הצג רק את הטקסט הסופי לפרסום." },
      {
        role: "user",
        content:
          `היי אני ${name}. בשל המצב הביטחוני, אני רוצה לארח משפחות שפונו מביתן להתארח בביתי באזור ${location} עד ${capacity} אנשים שהמודעה תהיה מנוסחת כפונה ללשון זכר ברבים.
${genderInstruction}
כתוב פוסט קצר, ברור, רגיש ומכבד. ללא הקדמות—רק את הטקסט לפרסום, תבין שלא מודבר בחופשה אלא באירוח ממש ולכן אני לא רוצה שום איזכור לחופשה או איזכור תשלום. ותוודא שהמודעה פונה ללשון זכר ברבים.`
      }
    ],
    model: "gpt-4o-mini",
  });

  return completion.choices[0].message.content;
}
