import { Link } from 'react-router-dom';

const btnStyle = 'text-black bg-[white] border-[1px] border-[black] font-bold text-[20px] hover:opacity-[0.8] px-4 py-2 rounded-full';

export default function Welcome() {
    return (
        <div className="flex flex-col items-center justify-start h-screen"> {/* Changed justify-center to justify-start */}
            <div className="text-center mt-10 mb-2"> {/* Added mb-6 to create more space from the top and bottom */}
                <p> ברוכים הבאים לאתר שלנו Safe South!</p>
                <p>האתר נוצר למען אזרחי המדינה היקרים, אשר בזמן המלחמה נרתמים אחד למען השני,</p>
                <p>ומארחים משפחות מפונות מהדרום / צפון במרכז.</p>
                <hr />
                <p>הצטרפו למטרה, הרתמו לעשייה, וביחד ננצח!</p>
            </div>
            <div className="m-20 mb-30 min-w-[80%] flex flex-row items-center justify-around"> {/* Added mb-10 to create more space from the top */}
                <Link className={btnStyle} to="/feed">אשמח להתארח</Link>
                <Link className={btnStyle} to="/register">אשמח לארח</Link>
            </div>
        </div>
    );
}
