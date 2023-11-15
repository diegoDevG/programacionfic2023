'use client';
import Image from 'next/image';

const Share = () => {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <>
      <a
        href={`https://api.whatsapp.com/send?text=Mira%20este%20evento%20del%20FIC%202023%3A%20https%3A%2F%2F${currentUrl}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src="/images/whatsapp.svg"
          alt="whatsapp"
          className="w-7 h-7"
          width={24}
          height={24}
        />
      </a>
      <a
        className="border-2 inline-flex items-center mb-1 mr-1 transition p-1 rounded-full text-white border-neutral-600 bg-neutral-600 hover:bg-neutral-700 hover:border-neutral-700"
        target="_blank"
        rel="noopener noreferrer"
        href={`https://facebook.com/sharer/sharer.php?u=${currentUrl}`}
        aria-label="Share on Facebook"
      >
        <svg
          aria-hidden="true"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="w-4 h-4"
        >
          <path d="M379 22v75h-44c-36 0-42 17-42 41v54h84l-12 85h-72v217h-88V277h-72v-85h72v-62c0-72 45-112 109-112 31 0 58 3 65 4z"></path>
        </svg>
      </a>
      <a
        className="border-2 inline-flex items-center mb-1 mr-1 transition p-1 rounded-full text-white border-neutral-600 bg-neutral-600 hover:bg-neutral-700 hover:border-neutral-700"
        target="_blank"
        rel="noopener noreferrer"
        href={`https://twitter.com/intent/tweet?url=${currentUrl}`}
        aria-label="Share on Twitter"
      >
        <svg
          aria-hidden="true"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="w-4 h-4"
        >
          <path d="m459 152 1 13c0 139-106 299-299 299-59 0-115-17-161-47a217 217 0 0 0 156-44c-47-1-85-31-98-72l19 1c10 0 19-1 28-3-48-10-84-52-84-103v-2c14 8 30 13 47 14A105 105 0 0 1 36 67c51 64 129 106 216 110-2-8-2-16-2-24a105 105 0 0 1 181-72c24-4 47-13 67-25-8 24-25 45-46 58 21-3 41-8 60-17-14 21-32 40-53 55z"></path>
        </svg>
      </a>
    </>
  );
};

export default Share;
