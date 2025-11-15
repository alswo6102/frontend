'use client';

export default function Header() {
    return (
        <header className="w-full h-(--header-height) flex items-center justify-center border-b-2 border-dashed border-gray-300">
            <p className="text-4xl m-0 text-black" style={{ fontFamily: 'MeetMe' }}>
                멋사 조짜조
            </p>
        </header>
    )
}