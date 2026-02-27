export default function RatingStars({rating, setRating}){
  return(
    <div className="flex gap-2">
      {[1,2,3,4,5].map(n=>(
        <button
          key={n}
          type="button"
          onClick={() => setRating(n)}
          className={`cursor-pointer text-2xl ${n <= rating ? 'text-yellow-400' : 'text-gray-400'}`}
          aria-label={`Rate ${n} stars`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
