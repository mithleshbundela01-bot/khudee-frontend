function ReserveSuccess() {

  return (

    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-50 px-6 py-16">

      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-12 text-center">

        {/* SUCCESS */}

        <div className="text-7xl mb-8">

          🔥

        </div>

        <h1 className="text-6xl font-black leading-tight text-gray-900">

          Your Tee Is Reserved

        </h1>

        <p className="mt-8 text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">

          Thank you for supporting KhuDee early.

          Your reservation helps us understand which pieces deserve production first.

        </p>

        {/* BRAND MESSAGE */}

        <div className="mt-16 text-left">

          <h2 className="text-5xl font-black leading-tight text-gray-900">

            Help Us Build

            <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">

              {" "}KhuDee

            </span>

          </h2>

          <p className="mt-8 text-lg text-gray-600 leading-relaxed">

            KhuDee is an early-stage streetwear brand.

            Before moving into full-scale production, we’re trying to understand which designs people genuinely want to wear.

            If people truly resonate with these tees, we’ll move toward real drops, premium production, and full-scale launches.

          </p>

          <div className="mt-6 text-green-600 font-bold text-xl">

            No payment required right now.

          </div>

        </div>

        {/* DISABLED BUTTON */}

        <button
          disabled
          className="mt-14 px-12 py-5 rounded-full bg-gray-300 text-gray-600 text-xl font-black cursor-not-allowed"
        >

          Place Order Coming Soon

        </button>

      </div>

    </div>
  );
}

export default ReserveSuccess;