import React, { useEffect, useState } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

function JokeList({numJokesToGet = 5}) {
    const [jokes, setJokes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(function(){
        async function getJokes(){
            let j = [...jokes];
            let seenJokes = new Set();
            try{
                while(j.length < numJokesToGet){
                    let res = await axios.get("https://icanhazdadjoke.com/", {
                        headers: {Accept: "application/json"}
                    });
                    let {...jokeObj} = res.data;
                    if(!seenJokes.has(jokeObj.id)){
                        seenJokes.add(jokeObj.id);
                        j.push({...jokeObj, votes: 0});
                    } else {
                        console.error("duplicate found!");
                    }
                    
            }
            setJokes(j);
            setIsLoading(false);
        }catch(e){
            console.error(e);} 
        }
        if(jokes.length === 0) getJokes();
    }, [jokes, numJokesToGet]);

    function generateNewJoke(){
        setJokes([]);
        setIsLoading(true);
    }

    function vote(id, delta){
        setJokes(allJokes => allJokes.map(j => (j.id === id ? {...j, votes: j.votes + delta} : j)));
    }

    if(isLoading){
        return(
            <div className="loading">
                <i className="fas fa-4x fa-spinner fa-spine"/>
            </div>
        )
    }

    let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

    return(
        <div className="JokeList">
            <button className="JokeList-getmore" onClick={generateNewJoke}>
                Get New Jokes
            </button>
            {sortedJokes.map(({joke, id, votes}) => (
                <Joke key={id} id={id} votes={votes} text={joke} vote={vote}/>
            ))}
        </div>
    );
}

export default JokeList;
