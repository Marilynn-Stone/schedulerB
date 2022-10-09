import { useState, useEffect, useReducer } from "react";
import axios from "axios";

export default function useApplicationData() {

  
  
  
  
  const countNullInterviews = (day, appointments) => {
    let count = 0;
    for (const id of day.appointments) {
      if(!appointments[id].interview) {
        count++;
      }
    }
    return count;
  };

  const updateSpots = (days, appointments) => {
    return days.map(day => {
      const spots = countNullInterviews(day, appointments);
      return {...day, spots};
    });
  };
  
  function cancelInterview(id) {
    const appointment = {
			...state.appointments[id],
			interview: null
		};
		const appointments = {
			...state.appointments,
			[id]: appointment
		};
    const days = updateSpots(state.days, appointments);
		return axios.delete (`/api/appointments/${id}`)
			.then((res) => {
				setState({...state, appointments, days});
			})
	};

	function bookInterview(id, interview) {
    const appointment = {
			...state.appointments[id],
			interview: { ...interview }
		};
		const appointments = {
			...state.appointments,
			[id]: appointment
		}; 
    const days = updateSpots(state.days, appointments);

		return axios.put(`/api/appointments/${id}`, {interview})
			.then((res) => {
				setState({...state, appointments, days });	
			})
	};

	useEffect(() => {
		Promise.all([
			axios.get('/api/days'),
			axios.get('/api/appointments'),
			axios.get('/api/interviewers')
		]).then((all) => {
			setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}));
		});
  }, []);

  const [state, setState] = useState({
      day: "Monday",
      days: [],
      appointments: {},
      interviewers: {}
    });
  

  return { state, setDay, bookInterview, cancelInterview};
}