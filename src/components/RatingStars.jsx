export default function RatingStars({rating,setRating}){
  return(
    <div className="flex gap-2">
      {[1,2,3,4,5].map(n=>(
        <span key={n}
          onClick={()=>setRating(n)}
          className={`cursor-pointer text-2xl ${n<=rating?'text-yellow-400':'text-gray-400'}`}>
          ★
        </span>
      ))}
    </div>
  );
}