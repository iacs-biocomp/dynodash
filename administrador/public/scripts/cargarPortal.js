const cargarPortal = async(req, res = Response) => {
    const  {username, password} = await res.json();
    console.log(username);
}




await cargarPortal();