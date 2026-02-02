import OpenAI from "openai";

export default async function completions(
  name: string, 
  location: string, 
  capacity:string
  ) {
const openai = new OpenAI({apiKey: import.meta.env.VITE_OPENAI_API_KEY,dangerouslyAllowBrowser:true});
  const completion = await openai.chat.completions.create({
    messages: [
        { role: "system", content: "אתה עוזר לכתוב תוכן פוסט לאירוח משפחות שפונו מביתן בשל מיקומו באיזור לחימה שהמשתמש אחראי על האירוח" },
        { role: "user", 
        content: `היי אני ${name} ובשל המצב הביטחוני, אני מאחרת משפחות שפונו מביתן בשל המצב הביטחוני מאזור הדרום והצפון להתארח בביתי באזור ${location} עד ${capacity} עזור לי לנסח תוכן פוסט קצר לפרסום עם הפרטים הללו, האירוח הוא חינם אז לא לציין כלום על מחירים. אני מדגישה שלא מדובר בחופשה. בנוסף הצג ישירות את התוכן ללא הקדמה של התשובה שלך. ` }
    ],
    model: "gpt-3.5-turbo",
  });
  return completion.choices[0].message.content
}


