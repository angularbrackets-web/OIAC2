export const showNotification = (status : string, message: string, divClassName: string) => {
    const alertDiv = document.querySelector(`.${divClassName}`)
    
    if(status === 'success')
        alertDiv?.classList.add('bg-green-200', 'text-green-800', 'border-green-300')

    if(status === 'error')
        alertDiv?.classList.add('bg-red-200', 'text-red-800', 'border-red-300')

    if(status === 'warning')
        alertDiv?.classList.add('bg-yellow-200', 'text-yellow-800', 'border-yellow-300')

    alertDiv && (alertDiv.innerHTML = message)
    
    alertDiv?.classList.remove('hidden', 'animate-fade-out-down')
    alertDiv?.classList.add('block', 'animate-fade-in-down')
    
    
    setTimeout(()=>{
        alertDiv?.classList.add('hidden', 'animate-fade-out-down')
        alertDiv?.classList.remove('block')
        alertDiv && (alertDiv.innerHTML = message)
        alertDiv?.classList.remove('bg-green-200', 'text-green-800', 'border-green-300', 'bg-red-200', 'text-red-800', 'border-red-300', 'bg-yellow-200', 'text-yellow-800', 'border-yellow-300')
    },5000)
}