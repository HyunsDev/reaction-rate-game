import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import dotenv from 'dotenv'
import './css/app.scss';
import './css/game.scss'
import './css/screen.scss'
dotenv.config()

const ScreenBtns = (props) => {
  return (<div className={`btns`} onClick={() => props.click() }>
    <div className={`btn`}>
      {props.text}
    </div>
  </div>)
}

const Screen = (props) => {
  return (
    <div className='screen'>
      <div />
      <div className='explain'>
        <h1>POS 반응속도 게임</h1>
        <p>혼자서 플레이</p>
        <br /><br />
        <p>시작 버튼을 누르면 노란색 화면이 표시됩니다.<br />노란색 화면이 초록색으로 바뀐 순간 터치!<br />언제 바뀔지 모르니 긴장하세요</p>
      </div>
      <ScreenBtns text="시작" click={props.gameStart} />
    </div>
  )
}

const Result = (props) => {
  const [userName, setUserName] = useState("")
  const [isInputAble, setInputAble] = useState(true)

  const keyPress = async (e) => {
    if (e.key === 'Enter' && isInputAble) {
        try {
          const response = await axios.post(process.env.REACT_APP_API_SERVER,{
              name: userName,
              score: props.score,
              key: process.env.REACT_APP_API_KEY
          });
          console.log(response);
        } catch (error) {
          console.error(error);
        }
    }
  }

  const onchange = (e) => {
    setUserName(e.value)
  }

  return (
    <div className='screen'>
      <div className='result'>
        <p>내 반응 속도</p>
        <div className='user-result'>{props.score}ms</div>
        <input onKeyPress={keyPress} onChange={onchange} value={userName.value} type={"text"} placeholder='이름을 입력하세요' className='input-name'/>
        <div className='ranking'>
          <div className='rank-title'>최근 기록</div>
          <div className='ranks'>
            <div className='rank'>
              <div className='name'>박현우</div>
              <div className='score'>200ms</div>
            </div>
          </div>
        </div>
      </div>
      <ScreenBtns text="돌아가기" click={props.gameReset} />
    </div>
  )
}

const Game = (props) => {
  const [isWaiting, setWaiting] = useState(true)
  const [isShowScreen, setShowScreen] = useState(true)
  const [isShowResult, setShowResult] = useState(false)
  const clickStartTime = useRef(0)
  const firstTimer = useRef(0)
  const secondTimer = useRef(0)
  const score = useRef(0)

  const gameStart = () => {
    setShowScreen(false)
    setWaiting(true)
    const waitSecond = Math.floor(Math.random() * 4) + 3; // 3초 ~ 6초
    firstTimer.current = setTimeout(() => {
      setWaiting(false)
      clickStartTime.current = new Date()

      secondTimer.current = setTimeout(() => {
        gameEnd(true, 0)
      }, 2000)

    }, waitSecond*1000)
  }

  const screenClick = () => {
    clearTimeout(secondTimer.current)
    const now = new Date()
    score.current = now.getTime() - clickStartTime.current.getTime()
    gameEnd(false)
  }

  const gameEnd = (isFail) => {
    if (isFail) {
      setShowScreen(true);
      setWaiting(true);
      return
    } 
    setShowResult(true)
  }

  const gameReset = () => {
    clearTimeout(firstTimer.current)
    clearTimeout(secondTimer.current)
    setWaiting(true)
    setShowScreen(true)
    setShowResult(false)
  }

  return (
    <>
      {isShowScreen ? <Screen gameStart={gameStart} /> : <></>}
      {isShowResult ? <Result score={score.current} gameReset={gameReset} /> : <></>}
      <div className='game' style={{backgroundColor: isWaiting ? "#F5B608" : "#167E56"}} onMouseDown={!isWaiting ? screenClick : gameReset}>
        <div></div>
        <div className='title'>{isWaiting ? "초록색으로 바뀌면 터치하세요!" : "지금 터치하세요"}</div>
        <div className='name'>POS 반응 속도 게임</div>
      </div>
    </>
  ) 
}

function App() {
  const [isShowScreen, setShowScreen] = useState(true)

  return (
    <div className="App">
      <Game />
    </div>
  );
}

export default App;
