import { useEffect, useState, useContext, useRef, memo } from "react"
import { Buffer } from 'buffer'
import { SocketContext } from '../context/socket'
import iconCSV from '../assets/csv-file-icon.svg'
import Options from "./Options"

import papa from 'papaparse'

const INITIAL_ARGS = {
  suddenSize: false,
  noDump: false,
  ethPump: false,
  collectionPump: false,
}

const INITIAL_STATES = {
  isGardenerRunning: false,
  isGardenerPermission: false,
  GardenerArg: INITIAL_ARGS,
  isFarmorRunning: false,
  isFarmorPermission: false,
  FarmorArg: INITIAL_ARGS,
  isPurchaserRunning: false,
  isPurchaserPermission: false,
  PurchaserArg: INITIAL_ARGS,
  isAcceptorRunnung: false,
  isAcceptorPermission: false,
  AcceptorArg: INITIAL_ARGS,
  status: false
}

const activeIcon = {
  filter: "invert(35%) sepia(72%) saturate(446%) hue-rotate(73deg) brightness(99%) contrast(90%)"
}

const Dashboard = ({ setSigned }) => {
  const socket = useContext(SocketContext)
  const [errorMessage, setErrorMessage] = useState('')
  const [switches, setSwitches] = useState(INITIAL_STATES)
  const [module, setModule] = useState(null)
  const [file, setFile] = useState(null)
  const inputFile = useRef(null)

  const showMessage = (errorMessage, timeout = 5000) => {
      setErrorMessage(errorMessage)     
      setTimeout(() => setErrorMessage(''), timeout)
  }

  const walletAddress = '0xceed8bfa1c058a965bc...example...055d10170798669294871a3'

  const getArgs = (moduleName) => switches[moduleName + 'Arg'] ?? INITIAL_ARGS

  socket.on('message', data => {
    if (data.code === "3") {
      const _switches = {}
      const items = JSON.parse(data.message)
      for (let item in items) {
        typeof items[item] === "string"
          ? _switches[item] = items[item] === "" ? INITIAL_ARGS : JSON.parse(items[item])
          : _switches[item] = items[item]
      }

      setSwitches(_switches)
    }
  })

  useEffect(() => {
    const data = { code: '3' }
    socket.emit("message", data)

    return () => {
      socket.off("message", data)
    }
  }, [])

  const handleChange = async (e) => {
    let data = { code: '14', message: e.target.name }

    if (e.target.checked) {
      if (!file || e.target.name !== module) return showMessage('Please select a file')

      data = {
        code: '13',
        message: {
          moduleName: e.target.name,
          csvFile: file.toString('base64'),
          jsonParams: JSON.stringify({ ...getArgs(e.target.name) })
        }
      }
    }

    let _switches = { ...switches }
    _switches[e.target.dataset.value] = e.target.checked
    setSwitches(_switches)

    socket.emit("message", data)
  }

  const handleSelectFile = (e) => {
    e.preventDefault()

    if (!switches.status) {
      return showMessage('Please connect to the server first')
    }

    setFile(null)
    setModule(e.target.name)

    inputFile.current.value = ''
    inputFile.current.click()
  }

  const onChangeFile = (e) => {
    e.stopPropagation()
    e.preventDefault()

    const fileReader = new FileReader()
    const files = e.target.files
    if (files.length === 0) return

    const file = files[0]

    if (file) {
      fileReader.onload = function (e) {
        let allKeyPresent = false

        papa.parse(file, {
            worker: true,
            header:true,                
            skipEmptyLines:true,
            step: function(row, parser) {
              if (!allKeyPresent) {
                  const keys = Object.keys(row.data)
                  if(!keys.includes('Collection')) parser.abort()

                  allKeyPresent = true
              }
            },
            complete: function(results) {
                //console.log('parsing complete read', results)
                if(!allKeyPresent) return

                const csvOutput = e.target.result
                setFile(new Buffer.from(csvOutput))
            }
        })
      }

      fileReader.readAsText(file)
    }
  }

  const handleSignout = () => {
    setSigned(false)
    localStorage.clear()
  }

  return (
    <>
      <div className="m-4 w-full max-w-3xl relative">
        <div className="h-4 mb-2 absolute top-2 sm:right-8 right-4">
          {
            errorMessage && (
              <div className="text-red-600 font-semibold text-sm"> {errorMessage} </div>
            )
          }
          </div>
        <form className="bg-white shadow-lg rounded sm:px-8 px-4 pt-6 pb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <h2 className="text-sm">{walletAddress}</h2>

          <table className="min-w-full mt-4 border text-center text-sm font-light dark:border-neutral-500">
            <tbody>
              {/* Gardener  */}
              <tr className="border-b dark:border-neutral-500">
                <td className="whitespace-nowrap border-r px-4 py-2 dark:border-neutral-500 font-medium text-xl text-left flex flex-row justify-between items-center">
                  <span>Gardener</span>
                  <label className={`relative inline-flex items-center ${switches.isGardenerPermission? 'cursor-pointer': 'cursor-not-allowed'}`}>
                    <input
                      type="checkbox"
                      name="Gardener"
                      data-value="isGardenerRunning"
                      className="sr-only peer"
                      checked={switches.isGardenerRunning}
                      onChange={handleChange}
                      disabled={!switches.isGardenerPermission}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </td>
                <td className="whitespace-nowrap min-w-20 border-r px-4 py-2 dark:border-neutral-500">
                  <div className="flex justify-center">
                    <button onClick={handleSelectFile} disabled={!switches.isGardenerPermission} className={`${switches.isGardenerPermission? 'cursor-pointer': 'cursor-not-allowed'}`}>
                      <img src={iconCSV} width={24} height={24} alt="" name="Gardener" style={file && module === 'Gardener' ? activeIcon : {}} />
                    </button>
                  </div>
                </td>
                <td className="whitespace-nowrap border-r px-4 py-2 dark:border-neutral-500">
                  <div className="flex justify-left">
                    <Options
                      switches={switches}
                      setSwitches={setSwitches}
                      moduleName="Gardener"
                    />
                  </div>
                </td>
              </tr>
              {/* Farmor */}
              <tr className="border-b dark:border-neutral-500">
                <td className="whitespace-nowrap border-r px-4 py-2 dark:border-neutral-500 font-medium text-xl text-left flex flex-row justify-between items-center">
                  <span>Farmor</span>
                  <label className={`relative inline-flex items-center ${switches.isFarmorPermission? 'cursor-pointer': 'cursor-not-allowed'}`}>
                    <input
                      type="checkbox"
                      name="Farmor"
                      data-value="isFarmorRunning"
                      className="sr-only peer"
                      checked={switches.isFarmorRunning}
                      onChange={handleChange}
                      disabled={!switches.isFarmorPermission}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </td>
                <td className="whitespace-nowrap border-r px-4 py-2 dark:border-neutral-500">
                  <div className="flex justify-center">
                    <button onClick={handleSelectFile} disabled={!switches.isFarmorPermission} className={`${switches.isFarmorPermission? 'cursor-pointer': 'cursor-not-allowed'}`}>
                      <img src={iconCSV} width={24} height={24} alt="" name="Farmor" style={file && module === 'Farmor' ? activeIcon : {}} />
                    </button>
                  </div>
                </td>
                <td className="whitespace-nowrap border-r px-4 py-2 dark:border-neutral-500">
                  <div className="flex justify-left">
                  </div>
                </td>
              </tr>
              {/* Purchaser */}
              <tr className="border-b dark:border-neutral-500">
                <td className="whitespace-nowrap border-r px-4 py-2 dark:border-neutral-500 font-medium text-xl text-left flex flex-row justify-between items-center">
                  <span>Purchaser</span>
                  <label className={`relative inline-flex items-center ${switches.isPurchaserPermission? 'cursor-pointer': 'cursor-not-allowed'}`}>
                    <input
                      type="checkbox"
                      name="Purchaser"
                      data-value="isPurchaserRunning"
                      className="sr-only peer"
                      checked={switches.isPurchaserRunning}
                      onChange={handleChange}
                      disabled={!switches.isPurchaserPermission}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </td>
                <td className="whitespace-nowrap border-r px-4 py-2 dark:border-neutral-500">
                  <div className="flex justify-center">
                    <button onClick={handleSelectFile} disabled={!switches.isPurchaserPermission} className={`${switches.isPurchaserPermission? 'cursor-pointer': 'cursor-not-allowed'}`}>
                      <img src={iconCSV} width={24} height={24} alt="" name="Purchaser" style={file && module === 'Purchaser' ? activeIcon : {}} />
                    </button>
                  </div>
                </td>
                <td className="whitespace-nowrap border-r px-4 py-2 dark:border-neutral-500">
                  <div className="flex justify-left">
                  </div>
                </td>
              </tr>
              {/* Acceptor */}
              <tr className="border-b dark:border-neutral-500">
                <td className="whitespace-nowrap border-r px-4 py-2 dark:border-neutral-500 font-medium text-xl text-left flex flex-row justify-between items-center">
                  <span>Acceptor</span>
                  <label className={`relative inline-flex items-center ${switches.isAcceptorPermission? 'cursor-pointer': 'cursor-not-allowed'}`}>
                    <input
                      type="checkbox"
                      name="Acceptor"
                      data-value="isAcceptorRunnung"
                      className="sr-only peer"
                      checked={switches.isAcceptorRunnung}
                      onChange={handleChange}
                      disabled={!switches.isAcceptorPermission}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </td>
                <td className="whitespace-nowrap border-r px-4 py-2 dark:border-neutral-500">
                  <div className="flex justify-center">
                    <button onClick={handleSelectFile} disabled={!switches.isAcceptorPermission} className={`${switches.isAcceptorPermission? 'cursor-pointer': 'cursor-not-allowed'}`}>
                      <img src={iconCSV} width={24} height={24} alt="" name="Acceptor" style={file && module === 'Acceptor' ? activeIcon : {}} />
                    </button>
                  </div>
                </td>
                <td className="whitespace-nowrap border-r px-4 py-2 dark:border-neutral-500">
                  <div className="flex justify-left">
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Status */}
          <div className="my-4 mx-4 text-lg">
            <div className="flex justify-start">
              Is authorized: {
                localStorage.getItem('isAuthorized') === '1'
                  ? <span className="text-green-800 ml-1">true</span>
                  : <span className="text-red-800 ml-1">false</span>
              }
            </div>
            <div className="flex justify-between">
              <div>
                Status: {
                  switches.status
                    ? <span className="text-green-800">true</span>
                    : <span className="text-red-800">false</span>
                }
              </div>
              <div>
                <a className="text-blue-500 text-sm text-transform: uppercase cursor-pointer" onClick={handleSignout}>{switches.status ? 'Signout' : 'Re-signin'}</a>
              </div>
            </div>
          </div>

          {/* File */}
          <input type='file' id='file' accept='.csv,text/csv' ref={inputFile} onChange={onChangeFile} className="hidden" />
        </form>
      </div>
    </>
  )
}

export default memo(Dashboard)