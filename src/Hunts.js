let hunt = {
  hunt_id: 1,
  hunt_name: "Martins utdrikningslag",
  locations: [
    {
      post_id: 1,
      post_name: "Nydalen Bryggeri",
      coordinates: {
        lat: 59.950313170793166,
        lng: 10.76434599639627,
      },
      radius: 50,
      hint: "Lønningspils",
      isFound: false,
    },
    {
      post_id: 2,
      post_name: "BI Nydalen",
      coordinates: {
        lat: 59.949107987046006,
        lng: 10.768578221529944,
      },

      radius: 50,
      hint: "Betalt utdanning, Frederik",
      isFound: false,
    },
    {
      post_id: 3,
      post_name: "Fly Chicken Storo",
      coordinates: {
        lat: 59.947482697043675,
        lng: 10.770985011587864,
      },

      radius: 50,
      hint: "Dagen derpå-mat",
      isFound: false,
    },
    
  ],
  finalMessage: "Wow du er flink ass",
};

export async function fetchHunt(huntId) {
  // return Promise.resolve(hunt);

  const resHunt = await fetch(`${process.env.REACT_APP_HUNT_API_URL}/hunt/${huntId}`);
  const hunt = await resHunt.json();

  const resLocations = await fetch(`${process.env.REACT_APP_HUNT_API_URL}/locations/${huntId}`);
  const locations = await resLocations.json();

  hunt.locations = locations;

  const locationsWithBundledCoordinates = hunt.locations.map(location => {
    return (
      {
        post_id: location.post_id,
        post_name: location.post_name,
        radius: location.radius,
        hint: location.hint,
        isFound: false,
        coordinates: {
          lat: parseFloat(location.lat),
          lng: parseFloat(location.lng),
        }
      }
    )
  })

  hunt.locations = locationsWithBundledCoordinates;

  return hunt;
}

export async function fetchAllHunts() {
  const res = await fetch(`${process.env.REACT_APP_HUNT_API_URL}/allhunts`);
  const allHunts = await res.json();

  return allHunts;
}

export default hunt;
