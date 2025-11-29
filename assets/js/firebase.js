import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getDatabase, ref, set, push, get } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";


const firebaseConfig = {
  apiKey: "AIzaSyBG1R0lwhXCEr1uT-tlrtjGQt6yUIxitxk",
  authDomain: "landing-b43d8.firebaseapp.com",
  databaseURL: "https://landing-b43d8-default-rtdb.firebaseio.com",
  projectId: "landing-b43d8",
  storageBucket: "landing-b43d8.firebasestorage.app",
  messagingSenderId: "284355547407",
  appId: "1:284355547407:web:0262b210384b2dac03ae7a",
  measurementId: "G-GBEDMG103R"
};

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

let saveVote = (rateId) =>{
    const votesRef= ref(database, 'votes');
    const newVoteRef= push(votesRef);

    return set(newVoteRef, {
        rateId: rateId,
        timestamp: Date.now()
    })
    .then(() =>{
        return {
            status: true,
            message: "Vote saved successfully"
        }
    })
    .catch((error) =>{
        console.error("Error saving vote: ", error);
        return {
            status: false,
            message: "Error saving vote"
        }
    });
}

const getVotes = async () => {
    try {
        const  db = getDatabase();

        const votesRef = ref(db, "votes");

        const snapshot = await get(votesRef);

        if(snapshot.exists()){
            return{
                success: true,
                data: snapshot.val()
            };
        } else{
            return{
                success: false,
                message: "No hay datos disponibles"
            };
        }

    } catch (error) {
        return{
            succes: false,
            message: error.message
        };
    }
};

export {saveVote, getVotes}