fetch(`http://localhost:3000/year/2022`)
  .then((response) => response.json())
  .then((data) => console.log(data));
