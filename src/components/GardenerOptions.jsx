import { useState } from "react"

export default function GardenerOptions({
  protection, setProtection
}) {
  const [open, setOpen] = useState(false)

  const handleProtectionChange = (e) => {
    setProtection({ ...protection, [e.target.name]: e.target.checked })
  }

  return (
    <div className="inline-block relative min-w">
      <div className="inline-flex cursor-pointer" onClick={() => setOpen(state => !state)}>
        <div className="text-blue-500 text-base font-normal">Options</div>
        <svg className="fill-blue-500 h-4 w-4 mt-1 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
      </div>

      <div className={`max-w-fit px-4 py-6 absolute right-0 top-8 z-10 ${open ? '' : 'hidden'} text-gray-700 bg-blue-100 border rounded border-blue-200 shadow-lg text-left`}>
        <div className="px-2 font-semibold">Protection from</div>
        <div className="py-1 px-2">
          <input onChange={handleProtectionChange} type="checkbox" name="suddenSize" defaultChecked={protection.suddenSize} className="enabled:hover:border-gray-400 disabled:opacity-75 checked:bg-blue-500" />
          <label className="ml-2 text-sm font-normal">Sudden size and bidders above decreasing</label>
        </div>
        <div className="py-1 px-2">
          <input onChange={handleProtectionChange} type="checkbox" name="noDump" defaultChecked={protection.noDump} className="enabled:hover:border-gray-400 disabled:opacity-75 checked:bg-blue-500" />
          <label className="ml-2 text-sm font-normal">No dump for a long time</label>
        </div>
        <div className="py-1 px-2">
          <input onChange={handleProtectionChange} type="checkbox" name="ethPump" defaultChecked={protection.ethPump} className="enabled:hover:border-gray-400 disabled:opacity-75 checked:bg-blue-500" />
          <label className="ml-2 text-sm font-normal">ETH 1h/24h pump</label>
        </div>
        <div className="py-1 px-2">
          <input onChange={handleProtectionChange} type="checkbox" name="collectionPump" defaultChecked={protection.collectionPump} className="enabled:hover:border-gray-400 disabled:opacity-75 checked:bg-blue-500" />
          <label className="ml-2 text-sm font-normal" title="Collection 1D pump">Collection 1D pump</label>
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