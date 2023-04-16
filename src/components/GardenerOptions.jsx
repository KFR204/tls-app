import { useEffect, useState, useRef } from "react"


export default function GardenerOptions({
  protection, setProtection
}) {
  const ref = useRef()
  const [open, setOpen] = useState(false)

  const handleProtectionChange = (e) => {
    setProtection({ ...protection, [e.target.name]: e.target.checked })
  }

  useEffect(() => {
    const checkIfClickedOutside = e => {
      if (open && ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }

    document.addEventListener("click", checkIfClickedOutside)

    return () => {
      document.removeEventListener("click", checkIfClickedOutside)
    }
  }, [open])

  return (
    <div className="inline-block relative" ref={ref}>
      <div id="toggle" className="inline-flex cursor-pointer" onClick={() => setOpen(state => !state)}>
        <div className="text-blue-500 text-base font-normal">Options</div>
        <svg className="fill-blue-500 h-4 w-4 mt-1 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
      </div>

      <div id="hidden" className={`${open ? 'visible' : 'invisible'} px-4 py-6 absolute right-0 top-7 z-10 text-left text-base text-gray-700 bg-white border rounded border-gray-200 shadow-lg`}>
        <div className="px-2 font-semibold">Protection from</div>
        <hr />
        <div className="pt-4 px-2">
          <input onChange={handleProtectionChange} type="checkbox" name="suddenSize" defaultChecked={protection.suddenSize} className="enabled:hover:border-gray-400 disabled:opacity-75 checked:bg-blue-500" />
          <label className="ml-2 font-normal">Sudden size and bidders above decreasing</label>
        </div>
        <div className="pt-2 px-2">
          <input onChange={handleProtectionChange} type="checkbox" name="noDump" defaultChecked={protection.noDump} className="enabled:hover:border-gray-400 disabled:opacity-75 checked:bg-blue-500" />
          <label className="ml-2 font-normal">No dump for a long time</label>
        </div>
        <div className="pt-2 px-2">
          <input onChange={handleProtectionChange} type="checkbox" name="ethPump" defaultChecked={protection.ethPump} className="enabled:hover:border-gray-400 disabled:opacity-75 checked:bg-blue-500" />
          <label className="ml-2 font-normal">ETH 1h/24h pump</label>
        </div>
        <div className="pt-2 px-2">
          <input onChange={handleProtectionChange} type="checkbox" name="collectionPump" defaultChecked={protection.collectionPump} className="enabled:hover:border-gray-400 disabled:opacity-75 checked:bg-blue-500" />
          <label className="ml-2 font-normal" title="Collection 1D pump">Collection 1D pump</label>
        </div>

        {/* <div className="pt-2 px-2 font-semibold">Aggression level</div>
        <div className="py-1 px-2 flex justify-start" onChange={(e) => setAggressionLevel(e.target.value)}>
          <div>
            <input type="radio" defaultChecked={aggressionLevel === 'low'} value="low" name="aggressionLevel" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600" />
            <label className="ml-2 text-sm font-normal text-gray-900 dark:text-gray-300">Low</label>
          </div>
          <div className="ml-4">
            <input type="radio" defaultChecked={aggressionLevel === 'medium'} value="medium" name="aggressionLevel" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600" />
            <label className="ml-2 text-sm font-normal text-gray-900 dark:text-gray-300">Medium</label>
          </div>
          <div className="ml-4">
            <input type="radio" defaultChecked={aggressionLevel === 'high'} value="high" name="aggressionLevel" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600" />
            <label className="ml-2 text-sm font-normal text-gray-900 dark:text-gray-300">High</label>
          </div>
        </div> */}
      </div>
    </div>
  )
}