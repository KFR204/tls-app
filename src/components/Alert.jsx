const Alert = ({ text }) => {
  return (
    <div className="p-2 mb-4 bg-orange-600 items-center text-white leading-none lg:rounded-full flex lg:inline-flex" role="alert">
      <span className="flex rounded-full bg-orange-500 uppercase px-2 py-1 text-xs font-bold mr-3">Warning</span>
      <span className="font-semibold mr-2 text-sm text-left flex-auto">{text}</span>
    </div>
  )
}

export default Alert