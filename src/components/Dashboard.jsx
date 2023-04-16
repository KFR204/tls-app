import { useEffect, useState, useContext, useRef } from "react"
import { Buffer } from 'buffer'
import { SocketContext } from '../context/socket'
import iconCSV from '../assets/csv-file-icon.svg'
import toast, { Toaster } from 'react-hot-toast'
import GardenerOptions from "./GardenerOptions"

const INITIAL_STATES = {
  "isGardenerRunning": false,
  "isGardenerPermission": false,
  "isFarmorRunning": false,
  "isFarmorPermission": false,
  "isPurchaserRunning": false,
  "isPurchaserPermission": false,
  "isAcceptorRunnung": false,
  "isAcceptorPermission": false,
  "status": false
}

const activeIcon = {
  filter: "invert(35%) sepia(72%) saturate(446%) hue-rotate(73deg) brightness(99%) contrast(90%)"
}

const Dashboard = ({ setSigned }) => {
  const socket = useContext(SocketContext)
  const [switches, setSwitches] = useState(INITIAL_STATES)
  const [file, setFile] = useState(null)
  const inputFile = useRef(null)
  //const [aggressionLevel, setAggressionLevel] = useState('low')
  const [protection, setProtection] = useState({
    suddenSize: false,
    noDump: false,
    ethPump: false,
    collectionPump: false,
  })

  socket.on('message', data => {
    if (data.code === "3") {
      setSwitches(JSON.parse(data.message))
    }
  })

  useEffect(() => {
    const data = { code: '3' }
    socket.emit("message", data)

    return () => {
      socket.off("message", data)
    }
  }, [])

  const handleChange = async (event) => {
    let data = { code: '14', message: '' }

    if (event.target.checked) {
      if (!file) return toast('Please select a file')

      data = {
        code: '13',
        message: {
          moduleName: "Gardener",
          csvFile: file.toString('base64'),
          jsonParams: { ...protection }
        }
      }
    }

    let _switches = { ...switches }
    _switches[event.target.name] = event.target.checked
    setSwitches(_switches)

    socket.emit("message", data)
    setFile(null)
  }

  const handleSelectFile = () => {
    if (!switches.status) {
      return toast('Please connect to the server first')
    }
    inputFile.current.click()
  }

  const onChangeFile = (event) => {
    event.stopPropagation()
    event.preventDefault()

    const fileReader = new FileReader()

    const file = event.target.files[0]

    if (file) {
      fileReader.onload = function (event) {
        const csvOutput = event.target.result
        setFile(new Buffer.from(csvOutput))
      }

      fileReader.readAsText(file)
    }
  }

  const handleSignout = () => {
    setSigned(true)
    localStorage.clear()
    location.reload()
  }

  return (
    <>
      <div className="m-4 w-full max-w-3xl">
        <form className="bg-white shadow-lg rounded px-8 pt-6 pb-8">
          <h1 className="text-2xl mb-4 font-bold">Dashboard</h1>
          <table className="min-w-full border text-center text-sm font-light dark:border-neutral-500">
            <tbody>
              {/* Gardener  */}
              <tr className="border-b dark:border-neutral-500">
                <td className="whitespace-nowrap border-r px-4 py-2 dark:border-neutral-500 font-medium text-xl text-left flex flex-row justify-between items-center">
                  <span>Gardener</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isGardenerRunning"
                      className="sr-only peer"
                      checked={switches.isGardenerRunning}
                      onChange={handleChange}
                      disabled={!switches.isGardenerPermission}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </td>
                <td className="whitespace-nowrap border-r px-4 py-2 dark:border-neutral-500">
                  <div className="flex justify-center">
                    <img src={iconCSV} width={24} height={24} alt="" data-value="Gardener" onClick={handleSelectFile} className="cursor-pointer"
                      style={file ? activeIcon : {}} />
                  </div>
                </td>
                <td className="whitespace-nowrap border-r px-4 py-2 dark:border-neutral-500">
                  <div className="flex justify-left">
                    <GardenerOptions
                      protection={protection}
                      setProtection={setProtection}
                    />
                    {/* <Test
                      protection={protection}
                      setProtection={setProtection}
                    /> */}
                  </div>
                </td>
              </tr>
              {/* Farmor */}
              <tr className="border-b dark:border-neutral-500">
                <td className="whitespace-nowrap border-r px-4 py-2 dark:border-neutral-500 font-medium text-xl text-left flex flex-row justify-between items-center">
                  <span>Farmor</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isFarmorRunning"
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
                    <img src={iconCSV} width={24} height={24} alt="" data-value="Farmor" onClick={handleSelectFile} className="cursor-pointer" />
                  </div>
                </td>
                <td className="whitespace-nowrap border-r px-4 py-2 dark:border-neutral-500">
                  <div className="flex justify-left">
                    {/* <input onChange={handleTBA} type="checkbox" className="border-gray-300 rounded h-5 w-5" name="FarmorTBA" />
                    <label className="inline-block pl-[0.5rem] hover:cursor-pointer">TBA</label> */}
                  </div>
                </td>
              </tr>
              {/* Purchaser */}
              <tr className="border-b dark:border-neutral-500">
                <td className="whitespace-nowrap border-r px-4 py-2 dark:border-neutral-500 font-medium text-xl text-left flex flex-row justify-between items-center">
                  <span>Purchaser</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isPurchaserRunning"
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
                    <img src={iconCSV} width={24} height={24} alt="" data-value="Purchaser" onClick={handleSelectFile} className="cursor-pointer" />
                  </div>
                </td>
                <td className="whitespace-nowrap border-r px-4 py-2 dark:border-neutral-500">
                  <div className="flex justify-left">
                    {/* <input onChange={handleTBA} type="checkbox" className="border-gray-300 rounded h-5 w-5" name="PurchaserTBA" />
                    <label className="inline-block pl-[0.5rem] hover:cursor-pointer">TBA</label> */}
                  </div>
                </td>
              </tr>
              {/* Acceptor */}
              <tr className="border-b dark:border-neutral-500">
                <td className="whitespace-nowrap border-r px-4 py-2 dark:border-neutral-500 font-medium text-xl text-left flex flex-row justify-between items-center">
                  <span>Acceptor</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isAcceptorRunnung"
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
                    <img src={iconCSV} width={24} height={24} alt="" data-value="Acceptor" onClick={handleSelectFile} className="cursor-pointer" />
                  </div>
                </td>
                <td className="whitespace-nowrap border-r px-4 py-2 dark:border-neutral-500">
                  <div className="flex justify-left">
                    {/* <input onChange={handleTBA} type="checkbox" className="border-gray-300 rounded h-5 w-5" name="AcceptorTBA" />
                    <label className="inline-block pl-[0.5rem] hover:cursor-pointer">TBA</label> */}
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
          <input type='file' id='file' ref={inputFile} onChange={onChangeFile} className="hidden" />
        </form>
      </div>

      <Toaster
        position="top-center"
        toastOptions={{
          className: 'text-lg bg-orange-600 items-center text-white',
          duration: 5000,
        }}
      />
    </>
  )
}

export default Dashboard