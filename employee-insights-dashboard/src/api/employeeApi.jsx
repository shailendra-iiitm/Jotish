export async function fetchEmployees(){

  const res = await fetch(
    "https://backend.jotish.in/backend_dev/gettabledata.php",
    {
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        username:"test",
        password:"123456"
      })
    }
  );

  return res.json();

}