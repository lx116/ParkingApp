"use client"

export default function CarDistance({distance}) {
    if (distance <= 10){
        return(
        <>
            <h1>
               El carro se encuentra a una distancia de: {distance} cm
            </h1>
        </>)
    }



}