import OpenAI from "openai";

export default async function completions(
  name: string, 
  location: string, 
  capacity:string
  ) {
console.log("KEY?", import.meta.env.VITE_OPENAI_API_KEY);
const openai = new OpenAI({apiKey: import.meta.env.VITE_OPENAI_API_KEY,dangerouslyAllowBrowser:true});
  const completion = await openai.chat.completions.create({
    messages: [
        { role: "system", content: "אתה עוזר לכתוב תוכן לפוסט על אירוח משפחות שפונו מביתן בשל מיקומו באיזור לחימה, המשתמש אחראי על האירוח" },
        { role: "user", 
        content: `היי אני ${name} ובשל המצב הביטחוני, אני מעוניין לארח משפחות שפונו מביתן בשל המצב הביטחוני מאזור הדרום והצפון להתארח בביתי באזור ${location} עד ${capacity} עזור לי לנסח תוכן לפוסט קצר לפרסום עם הפרטים הללו, האירוח הוא חינם אז לא לציין כלום על מחירים. אדגיש- לא מדובר בחופשה. בנוסף, הצג ישירות את התוכן ללא הקדמה של התשובה שלך. ` }
    ],
    model: "gpt-4o-mini",
  });
  return completion.choices[0].message.content
}


