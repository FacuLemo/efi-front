"use client"
import { useState } from "react";
import CartSummary from "@/components/CartSummary";
import PaymentMethod from '@/components/PaymentMethod';
import CartConfirmation from '@/components/CartConfirmation';
import { useRouter } from 'next/navigation';
import PostData from "@/components/PostData";

function ComponentCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0),
    [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null),
    [cartTotal, setCartTotal] = useState(0)
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXJyZW50VXNlciI6eyJpZCI6MSwibmFtZSI6InZhbGVuIiwiZW1haWwiOiJ2YWxAZW4uY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkaFdqS0JCWFZiUnJhMW1sb0Y4U1ZPdTlpM2ZPOXVEMmZGY0t4cGNUdjM2bXZ4S002Q2J3d3UiLCJjcmVhdGVkQXQiOiIyMDI0LTEwLTIzVDIzOjA1OjAyLjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDI0LTEwLTIzVDIzOjA1OjAyLjAwMFoiLCJyb2xlSWQiOjIsIlJvbGUiOnsiaWQiOjIsIm5hbWUiOiJST0xFX0FETUlOIn19LCJpYXQiOjE3Mjk3NDMxMTh9.C_X50u91LLHPQaOfC411I7ozV0kRaOYIlMCAINGrR54"

  const router = useRouter();

  const handleNext = () => {
    if (currentIndex < components.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handlePaymentSelection = (method) => {
    setSelectedPaymentMethod(method);
  };

  const updateCartTotal = (total) => {
    setCartTotal(total);
  };

  const finishPurchase = async () => {
    let gamesInCart = JSON.parse(localStorage.getItem("gamesInCart")) || [];
  
    try {
      for (const gameId of gamesInCart) {
        try {
          await PostData(
            "purchases",
            { gameId: gameId },
            token
          );
  
          gamesInCart = gamesInCart.filter(id => id !== gameId);
          localStorage.setItem("gamesInCart", JSON.stringify(gamesInCart));
  
        } catch (error) {
          if (error.response && error.response.data.message === "User already has that game") {
            alert(error.response.data.message);
            gamesInCart = gamesInCart.filter(id => id !== gameId);
            localStorage.setItem("gamesInCart", JSON.stringify(gamesInCart));
          } else {
            alert(error.response.data.message);
            break;
          }
        }
      }
  
      localStorage.setItem("gamesInCart", "[]");
      router.push("/tienda");
  
    } catch (error) {
      alert("Error al finalizar la compra. Inténtalo de nuevo.");
      router.push("/tienda");
    }
  };
  


  const components = [
    <CartSummary updateCartTotal={updateCartTotal} />,
    <PaymentMethod onPaymentSelect={handlePaymentSelection} />,
    <CartConfirmation paymentMethod={selectedPaymentMethod} total={cartTotal} />
  ];

  let progress = ((currentIndex + 1) / components.length) * 100;

  return (
    <section className="flex flex-col h-screen">
      <div className={`w-full h-2 ${cartTotal == 0 && "hidden"}`}>
        <div
          className="h-full ease-in-out transition-all duration-[1500ms] bg-blue-400"
          style={{ width: `${progress}%` }}
        >
        </div>
      </div>

      <section className="flex-grow relative w-full overflow-x-hidden">
        <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {components.map((Component, index) => (
            <div key={index} className="w-full h-full flex-shrink-0">
              {Component}
            </div>
          ))}
        </div>
      </section>

      <footer className={` ${cartTotal != 0 ? "sticky" : "hidden"} bottom-0 flex justify-between p-4 bg-gray-700`}>
        <button
          type="button"
          className={`bg-blue-500 hover:bg-blue-600 text-white text-lg font-medium p-2 px-6 rounded-sm ${currentIndex === 0 ? 'opacity-0' : ''}`}
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          Previous
        </button>
        {currentIndex === components.length - 1 ? (

          selectedPaymentMethod ? (
            <button
              type="button"
              className={`bg-blue-500 hover:bg-blue-600 text-white text-lg font-medium p-2 rounded`}
              onClick={finishPurchase}
            >
              Confirm purchase
            </button>
          ) : (
            <button
              type="button"
              className={`static bg-gray-400 cursor-not-allowed text-white text-lg font-medium p-2 rounded`}
              disabled
            >
              Confirm purchase
            </button>
          )

        ) : (
          <button
            type="button"
            className={`bg-blue-500 hover:bg-blue-600 text-white text-lg font-medium p-2 px-6 rounded-sm`}
            onClick={handleNext}
            disabled={currentIndex === components.length - 1}
          >
            Next
          </button>

        )}
      </footer>
    </section >
  );
}

export default ComponentCarousel;