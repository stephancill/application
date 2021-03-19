import * as Tone from 'tone'
import {postData} from './Api'
import React, { Component,useEffect,useState,useRef } from 'react';


export default function Mixer() {
    window.Tone = Tone;
    const [loading, setLoading] = useState(false);
    const [greatSuccess, setGreatSuccess] = useState(false);
    const form = useRef(null);
    const [errorScript, setErrorScript] = useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(form.current);
        let object = {};
        formData.forEach(function(value, key){
            object[key] = value;
        });
        // TODO: do some validation for a common format
        object["created"] = Date.now();

        // TODO: perform transaction, (after verifying duplicates by hash on ipfs?)
        postData(object)
        .then( (hash) => {
            setGreatSuccess(true);
            console.log("created ipfs hash: ", hash);
        })
        .catch( (err) => alert("Error: " + err.message) )
        .finally( () => { setLoading(false); })
    }

    useEffect(() => {
    }, []);

    const playAudio = () => {
        try {
            setErrorScript(null);
            eval(form.current.script.value);
        } catch (err) {
            setErrorScript(err.message);
        }
    };

    return (
        <div className="p-3">
            <h4 className="text-center">Submit an NFT audio on the blockchain</h4>

            { (greatSuccess) ?
                <div className="alert alert-success" role="alert">
                  Audio created successfully
                </div> : <span></span>
            }

            <form ref={form} onSubmit={handleSubmit} className="needs-validation">
                <div className="form-group">
                    <label htmlFor="exampleInputTitle">Title</label>
                    <input type="text" className="form-control" id="exampleInputTitle" aria-describedby="titleHelp" placeholder="Insert a meaningful title" name="title" required={true} />
                </div>

                <div className="form-group">
                    <label htmlFor="descriptionInput">Description</label>
                    <input type="text" className="form-control" id="descriptionInput" aria-describedby="descriptionHelp" placeholder="Optional description" name="description" />
                </div>
                <hr/>
                <div className="form-group">
                    <label htmlFor="exampleFormControlTextarea1">Lyrics (javascript code)</label>
                    {//TODO: use codeMirror or some javascript editor
                    }
                    <textarea required={true} className="form-control" name="script" rows="3" aria-describedby="scriptHelp">{
                        "//play a middle 'C' for the duration of an 8th note \nnew Tone.Synth().toDestination().triggerAttackRelease(\"C4\", \"8n\");"
                     }</textarea>
                     { errorScript != null ?
                         <div className="alert alert-danger" role="alert">
                            Error: <span id="error-script">{errorScript}</span>
                         </div>:
                         <span></span>
                     }
                     <small id="scriptHelp" className="form-text text-muted">the Tone library is used, you can find more examples here <b>https://tonejs.github.io/docs</b></small>
                </div>

                <div className="form-group text-center">
                    <button type="button" className="btn btn-info" onClick={playAudio}>
                        Play the audio
                    </button>
                    { (loading) ?
                    <button className="btn btn-danger m-3" type="button" disabled>
                        <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                        Submitting on the blockchain...
                    </button>:
                    <input className="btn btn-danger m-3" type="submit" value="Submit on blockchain" />
                    }

                </div>


            </form>
        </div>
    );
}

