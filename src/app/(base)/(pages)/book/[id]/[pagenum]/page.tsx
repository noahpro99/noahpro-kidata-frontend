"use client"
import Link from "next/link";

// import { GET as routeHandler } from "../../../../api/activity/[id]/route";
import { Book, Page } from "@/util/BookData";
import Image from "next/image";
import React, { useState} from "react";
import { ColorPattern } from "@/components/ColorPattern";
import NumericalPattern from "@/components/NumericalPatter";
import { CodeComplete } from "@/components/CodeComplete";
import { Reader } from "@/components/Reader";
import { HokieBirdColoring } from "@/components/HokieBirdColor";
import { HokieBirdMap } from "@/components/HokieBirdMap";


const numericalProps = {
  pattern: [2, 4, 6, 8, '__', '__', '__'],
  answer: ["10", "12", "14"]
}

function BookImage({ image, page }: { image: string, page: Page}) {

  const [isImage] =  useState(image.includes("."));

  return (
    <div  className="flex flex-col flex-grow items-center justify-center">
      { isImage && 
        <Image src={image} alt="book image" width={300} height={500} />
      }
      { image === "HokieBirdActivity" &&
        <HokieBirdColoring props={page?.props}></HokieBirdColoring>
      }
      {
        image === "HokieBirdMazeActivity" &&
        <HokieBirdMap props={page?.props}></HokieBirdMap>
      }
    </div>
  );
}

function BookContent({ content, game }: { content: string[], game: string | null }) {

  return (
    <div className="flex flex-grow flex-col items-center justify-center bg-gray-100 rounded-2xl">
      <ul className="flex flex-col p-4">
        {content.map((line, i) => (
          <li className="text-center text-lg" key={i}>
            <Reader text={line} />
          </li>
        ))
        }
      </ul>
      {game && game === "color" && <ColorPattern/>}
      {game && game === "number" && <NumericalPattern pattern={numericalProps.pattern} answer={numericalProps.answer} />}
      {game && game === "code" && <CodeComplete beforeCode="if (" afterCode=") brushTeeth()" answer="teethDirty" choices={["eating", "teethDirty", "playing"]} />}
    </div>
  );
}


function ActivityBookDisplay({
  page, id
}: {
  page: Page,
  id: string
}) {
  return (
    <div className="flex flex-row flex-grow bg-white rounded-2xl shadow-xl p-2">
      <BookImage image={page.image} page={page} />
      <BookContent content={page.content} game={page.game} />
    </div>
  );
}

export default async function ActivityPage({ params }: { params: { id: string, pagenum: string } }) {
  const books: Book[] = [
  {
    BookId: 1,
    title: "Book 1 test",
    blurb: "some blurb",
    author: "Dev",
    pages: [
      {
        content: ["In this activity well go over different patterns and how to identify them.",
          "What is a pattern?",
          "Patterns and functions can be represented in many ways and described using words, tables, graphs, and symbols."
        ],
        image: "/lego-sort-example-clumping.png",
        game: null
      },
      {
        content: ["This is the first activity",
          "Lets try creating the pattern: Red, Red, Blue, Blue"],
        image: "/lego-sort-example-clumping.png",
        game: "color"
      },
      {
        content: ["Ok that wasn't too bad lets see how we do with numerical patterns.",
          "Lets try completing the pattern now!"],
        image: "/lego-sort-example-clumping.png",
        game: "number"
      },
      {
        content: ["Try completing this code snippet!"],
        image: "/lego-sort-example-clumping.png",
        game: "code"
      },
    ],
  },
  {
    BookId: 2,
    title: "Variables With Coloring",
    blurb: "Learn about different variables types, coloring the Hokie Bird!",
    author: "Dev",
    pages: [
      {
        content: ["In this book we will discover how to drag and drop different colors into variables",
          "We will also learn how to manually complete vairables!",
        ],
        image: "/HokieBird.png",
      },
      {
        content: ["Here you are able to drag and drop the different colors into the three differnt parts of the Hokie Bird.",
          "The Hokie Bird is split into three parts; a head, a body, and the legs.",
          "Try dragging different colors and see the changes happen live!",
          "Notice how the value on the right hand side changes when a color is dropped, this is the assignment of a variable"
        ],
        image: "HokieBirdActivity",
        props: {
          draggable: true
        }
      },
      {
        content: ["Now that you assigned variables by dragging values over them, lets try typing in the colors!",
                  "Click on the part of the Hokie Bird you would like to color and type in any of the listed colors",
                  "After pressing enter the values should update the color of the bird"
        ],
        image: "HokieBirdActivity",
        props: {
          type: true
        }
      },
    ],
    },
    
    {
      BookId: 3,
      title: "If-condition and For-loop with HokieBird Maze",
      blurb: "some blurb",
      author: "Dev",
      pages: [
        {
          content: ["In this book we will discover how to drag and drop different colors into variables",
          "We will also learn how to manually complete vairables!",
        ],
        image: "HokieBirdMazeActivity",
        props: {
            title: "Hokie Bird Maze",
            hokieBird: "LostHokieBird.png",
        }
        }
      ]
    }
  ] as Book[]
  
  const bookNum = parseInt(params.id) - 1
  const pageNum = parseInt(params.pagenum)
  const page = books[bookNum].pages[pageNum]

  function getNextPageNum() {
    return pageNum + 1 > books[bookNum].pages.length - 1 ? pageNum : pageNum + 1;
  }

  function getPrevPageNum() {
    return pageNum - 1 >= 0 ? pageNum - 1 : pageNum;
  }

  return (
    <div className="p-2 flex flex-col flex-grow h-[56rem]" >
      {books[bookNum] && <ActivityBookDisplay page={page} id={params.id} />}
      {!books[bookNum] &&
        <h1 className="text-center text-lg font-medium">
          We couldn't find anything for activity {params.id} here!
        </h1 >
      }
      {/* next and back buttons */}
      <div className="p-2">
        <div className="flex flex-row justify-between">
          <Link href={`/book/${params.id}/${getPrevPageNum()}`}>
            <button className="bg-primary-green hover:bg-hover-green hover:shadow-2xl text-white font-bold py-2 px-4 rounded-full text-3xl mx-2 fixed bottom-48 left-48">
              Back
            </button>
          </Link>
          <p>  {pageNum} </p>
          <Link href={`/book/${params.id}/${getNextPageNum()}`}>
            <button className="bg-primary-green hover:bg-hover-green hover:shadow-2xl text-white font-bold py-2 px-4 rounded-full text-3xl mx-2 fixed bottom-48 right-48">
              Next
            </button>
          </Link>
        </div>
      </div>
      {!page &&
        <div className="flex flex-col flex-grow items-center justify-center">
          <h1 className="text-center text-lg font-medium">
            We couldn't find anything for this page.
          </h1 >
        </div>
      }
    </div >
  )
}
