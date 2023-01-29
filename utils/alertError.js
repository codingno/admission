export default function alertError(error) {
	if(error.response)	
		alert(error.response.data)
	else
		alert(error)
}