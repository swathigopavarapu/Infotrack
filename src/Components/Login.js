import {
	Container,
	Button,
	Grid,
	Paper,
	TextField,
	IconButton,
	InputAdornment,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  
import axios from "axios";


const Login = (props) => {

const [values, setValues] = useState({
	userName: "",
	password: "",
	showPass: false,
});


const [formErrors,setFormErrors] = useState({})
const navigate = useNavigate();

const handleSubmit = (e) => {
	e.preventDefault();
	if(validate()){
	axios
		.post("https://uyenotest.infotracktelematics.com:5001/fms/v2/auth", {
			LoginName: values.userName,
			LoginPwd: values.password,
		})
		.then((res) => {
			// setLoggedIn(true)
        localStorage.setItem('USER-ACCESS-TOKEN',res.data.data.accessToken)
           
		navigate("/home");
		})
		.catch((err) => console.error(err));
	}
};
const validate = ()=>{
	const errors={};
	let isFormValid = true;
	if(!values.userName){
		isFormValid=false;
		errors.userName='Username is required!'
	}
	if(!values.password){
		isFormValid=false;
		errors.password = 'Password is required!'
	}

	setFormErrors(errors)
	return isFormValid

}
const handlePassVisibilty = () => {
	setValues({
		...values,
		showPass: !values.showPass,
	});
};

	return (
		<div>
<Container maxWidth="sm">
<Grid
	container
	spacing={2}
	direction="column"
	justifyContent="center"
	style={{ minHeight: "100vh" }}
>
<Paper elelvation={3} sx={{ padding: 5 }}>
<form onSubmit={handleSubmit}>
    <Grid item align='center'>
<h2>LOGIN</h2>
    </Grid>
<Grid container direction="column" spacing={3}>
	<Grid item>
		<TextField
			fullWidth
			label="UserName"
			variant="outlined"
			// required
			onChange={(e) => setValues({ ...values, userName: e.target.value })}
		/>
		<span style={{color:'red'}}>{formErrors.userName}</span>
	</Grid>

	<Grid item>
	<TextField
		type={values.showPass ? "text" : "password"}
		fullWidth
		label="Password"
		variant="outlined"
		// required
		onChange={(e) => setValues({ ...values, password: e.target.value })}
		InputProps={{
			endAdornment: (
				<InputAdornment position="end">
					<IconButton
						onClick={handlePassVisibilty}
						aria-label="toggle password"
						edge="end"
					>
						{values.showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
					</IconButton>
				</InputAdornment>
			),
		}}
	/>
	<span style={{color:'red'}}>{formErrors.password}</span>
	
	
	</Grid>

	<Grid item>
	<Button type="submit" fullWidth variant="contained" size='large'>
		LOGIN
	</Button>
	</Grid>
</Grid>
</form>
</Paper>
</Grid>
</Container>
		</div>
	);
};

export default Login;