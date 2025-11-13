import React, {  useEffect, useRef, useState } from 'react'
import './VideoCall.css'
import MedicineDetails from './MedicineDetails';
import { useParams } from 'react-router-dom';
import {toast} from 'react-toastify'
function Videocall() {
 const [username,SetUsername]=useState('')
 const[roomId,Setroomid]=useState()
  const webSocket=useRef(null);
  const[flag,Setflag]=useState(false)
  const[localstream,Setlocalstream]=useState(null)
  const [peerUsername, setPeerUsername] = useState('');
  const localVideoref=useRef(null)
  const peerConnection=useRef(null)
  const Datachannel=useRef(null)
  const offerref=useRef(null)
  const peeraMap=useRef({})
  const localstreamref=useRef(null)
 const role=localStorage.getItem('role')
 

 const {id,ref} =useParams()
useEffect(()=>{
  Setroomid(ref)
},[ref])
  async function getLocalStream(){
  
   
    try {
      const stream=await navigator.mediaDevices.getUserMedia({
        video:true,
        audio:true
      })
      if(localVideoref.current){
        localVideoref.current.srcObject=stream
        localVideoref.current.muted=true
       localstreamref.current=stream
      }
     
    } catch (error) {
      console.log(error)
    }
  }
  function sendSignal(action,message){
    console.log("send signal called")
    var json=JSON.stringify({
      'peer':username,
      'action':action,
      'message':message
    })
    webSocket.current.send(json)
  }
  function handlejoin(){
   
   Setflag(true)
   var endpoint = `ws://127.0.0.1:8004/ws/chat/${roomId}/`;
   webSocket.current=new WebSocket(endpoint);
   webSocket.current.addEventListener('open',async(e)=>{
    console.log("Connection opened !")
    await getLocalStream();
    sendSignal('new-peer',{})
   })
   webSocket.current.addEventListener('error',(e)=>{
    console.log("Connection has an error !")
   })
   webSocket.current.addEventListener('close',(e)=>{
    console.log("Connection Closed !")
   })
   webSocket.current.addEventListener('message',(e)=>{
    var parsed=JSON.parse(e.data);
    console.log(parsed)
    var peerUsername=parsed['peer']
    var action=parsed['action']
    if(username===peerUsername){
      return;
    }
    var receiver_channel_name=parsed['message']['receive_channel_name']
    console.log(receiver_channel_name+"akhilwd")
    if(action==='new-peer'){
      console.log('new-peer')
      createOfferer(peerUsername,receiver_channel_name);
      setPeerUsername(peerUsername);
      return ;
    }
    if(action==='new-offer'){
       offerref.current=parsed['message']['sdp']
      createAnswerer(offerref.current,receiver_channel_name)
    }
     if(action==='new-answer'){
      var answer=parsed['message']['sdp']
      if (peeraMap.current[peerUsername] && Array.isArray(peeraMap.current[peerUsername])) {
        var [peerConnection] = peeraMap.current[peerUsername];
        peerConnection.setRemoteDescription(answer);
    } else {
        console.error("peeraMap.current[peerUsername] is not an array or is undefined");
    }
      return
     }
   })
  
  }
  function createOfferer(username,receiver_channel_name){
    
    peerConnection.current = new RTCPeerConnection(null);
    
    Datachannel.current=peerConnection.current.createDataChannel('channel')
    Datachannel.current.addEventListener('open',()=>{
      console.log('Datachannel connection opened')
    })
    addLocalTracks(peerConnection.current);
    var remoteVideo=createVideo(username)
    setOntrack(peerConnection.current,remoteVideo)
     peeraMap.current[username]=[peerConnection.current,Datachannel.current]
     peerConnection.current.addEventListener('iceconnectionstatechange',()=>{
      var iceconnectionState=peerConnection.current.iceConnectionState
      if(iceconnectionState==='failed'||iceconnectionState==='disconnected'||iceconnectionState==='closed'){
        delete peeraMap.current[username]
        if(iceconnectionState !=='closed'){
          peerConnection.current.close()
        }
        removeVideo(remoteVideo);
      } 
     })
     peerConnection.current.addEventListener('icecandidate',(event)=>{
      if(event.candidate){
        console.log('new ice candidate',JSON.stringify(peerConnection.current.localDescription))
        return;
      }
      
      sendSignal('new-offer',{
        'sdp':peerConnection.current.localDescription,
        'receive_channel_name':receiver_channel_name
      })
     })
     peerConnection.current.createOffer().then(o=>peerConnection.current.setLocalDescription(o)).then(()=>{console.log('Local description set successfully')})
  }
  function addLocalTracks(peer){
    console.log("local stream is "+localstreamref.current)
     localstreamref.current.getTracks().forEach(track=>{
      peer.addTrack(track,localstreamref.current)
     })
  }
  function createVideo(peerUsername){
    var videoContainer = document.querySelector("#main-video-wrapper");
    var remoteVideo = document.createElement('video');
    remoteVideo.id = peerUsername + '-video';
    remoteVideo.className = 'remote-video';  // Add this line for CSS class
    remoteVideo.autoplay = true;
    remoteVideo.playsInline = true;

    var videoWrapper = document.createElement('div');
    videoWrapper.className = 'video-wrapper';
    videoWrapper.appendChild(remoteVideo);
    videoContainer.appendChild(videoWrapper);

    return remoteVideo;
  }
  function setOntrack(peer,remoteVideo){
    var remoteStream=new MediaStream()
    remoteVideo.srcObject=remoteStream
    peer.addEventListener('track',async(event)=>{
      remoteStream.addTrack(event.track,remoteStream);
    })
  }
  function removeVideo(video){
    var videoWrapper=video.parentNode;
    videoWrapper.parentNode.removeChild(videoWrapper);
  }
  function createAnswerer(username,receiver_channel_name){
    peerConnection.current = new RTCPeerConnection(null);
    addLocalTracks(peerConnection.current);
    var remoteVideo=createVideo(username)
    setOntrack(peerConnection.current,remoteVideo)

    peerConnection.current.addEventListener('datachannel',e=>{
      peerConnection.current.dc=e.channel;
      peerConnection.current.dc.addEventListener('open',()=>{
        console.log('Datachannel connection opened')
      })
      peeraMap.current[username]=[peerConnection.current,peerConnection.current.dc]
    })


    
     peerConnection.current.addEventListener('iceconnectionstatechange',()=>{
      var iceconnectionState=peerConnection.current.iceConnectionState
      if(iceconnectionState==='failed'||iceconnectionState==='disconnected'||iceconnectionState==='closed'){
        delete peeraMap.current[username]
        if(iceconnectionState !=='closed'){
          peerConnection.current.close()
        }
        removeVideo(remoteVideo);
      } 
     })
     peerConnection.current.addEventListener('icecandidate',(event)=>{
      if(event.candidate){
        console.log('new ice candidate',JSON.stringify(peerConnection.current.localDescription))
        return;
      }
      if (peerConnection.current.localDescription) {
        console.log(receiver_channel_name)
        sendSignal('new-answer', {
            sdp: peerConnection.current.localDescription,
            'receive_channel_name': receiver_channel_name // Ensure this is defined
        });
    } else {
        console.error('Local description is not set yet.');
    }
     })
    peerConnection.current.setRemoteDescription(offerref.current)
    .then(()=>{
      console.log('remote description set successfully %s',username)
      return peerConnection.current.createAnswer()
    })
    .then(a=>{
      console.log('Answer Created')
      peerConnection.current.setLocalDescription(a)
    })
  }
  function toggleAudio() {
    if (localstreamref.current) {
      localstreamref.current.getAudioTracks().forEach(track => (track.enabled = !track.enabled));
    } else {
      console.log("Local stream is not available.");
    }
  }
  
  function toggleVideo() {
    if (localstreamref.current) {
      localstreamref.current.getVideoTracks().forEach(track => (track.enabled = !track.enabled));
    } else {
      console.log("Local stream is not available.");
    }
  }
  function handleClose(){
    if(peerConnection.current){
      peerConnection.current.close()
      peerConnection.current=null
      localVideoref.current.srcObject=null
      
    }
    
  }
  return (
    <div className="container">
  {flag ? (
    <h1>{username}</h1>
  ) : (
    <div className="join-container">
      <input id="username" placeholder="Enter username" onChange={(e) => SetUsername(e.target.value)} />
      <input id="roomid" placeholder="Enter roomid" value={ref} readOnly/>
      <button id="btn-join" onClick={handlejoin}>
        Join Call
      </button>
    </div>
  )}

  <div className="row" id='medicineid'>
    {role == 2 ? (
      <div className="col-md-3" id="medsecond">
        <div className="medicine-form small-form">
          <MedicineDetails  id={id}/>
        </div>
      </div>
    ) : null}

    {/* Video call section */}
    <div className={role == 2 ? "col-md-9" : "col-md-12"} >
      <div id="video-container" className="video-section">
  <div className="video-wrapper" id="main-video-wrapper">
    {/* remote videos will be added here dynamically */}
    <video ref={localVideoref} id="local-video" autoPlay playsInline></video>
  </div>
        <div className="control-buttons">
          <button id="btn-toggle-audio" onClick={toggleAudio} className='btn btn-danger' >
            Audio Mute
          </button>
          <button id="btn-toggle-video" onClick={toggleVideo} className='btn btn-danger'>
            Video Off
          </button>
          <button className='btn btn-danger' onClick={handleClose}>Close</button>
        </div>
      </div>
    </div>
  </div>
</div>
  )
}

export default Videocall