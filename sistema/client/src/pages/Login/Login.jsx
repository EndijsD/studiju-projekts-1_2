import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { useState } from 'react';
import * as S from './style';
import { useNavigate } from 'react-router-dom';
import url from '../../../../url';
import axios from 'axios';

const initialValues = {
  email: '',
  password: '',
};

const Login = () => {
  const [formValues, setFormValues] = useState(initialValues);
  const [showPassword, setShowPassword] = useState(false);
  const [problem, setProblem] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const nav = useNavigate();

  const handleClickShowPassword = () =>
    setShowPassword((showPassword) => !showPassword);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    //Tiek pārbaudīts vai ievadlauki nav tukši
    if (formValues.email !== '' && formValues.password !== '') {
      //Tiek izveidota nosūtāmā informācija (Parole tiek šifrēta un tad tā tiek salīdzināta ar paroli servera pusē)
      let authInfo = {
        table: 'students',
        email: formValues.email,
        password: formValues.password,
      };
      try {
        //Dati tiek nosūtīti uz servera pusi
        setIsPending(true);
        const res = await axios.post(`${url}auth/login`, authInfo);
        if (res) console.log(res);
        //Ja serveris atgriež token un lietotāja id tad lietotājs tiek ielogots (yet to be done)
        if (res.data.accessToken !== undefined) {
          if (res.data.userType == 0) {
            nav('/userpage');
          } else {
            nav('/adminpage');
          }
        } else {
          setProblem(true);
          setIsPending(false);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      setProblem(true);
    }
  };

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    console.log(e.target.value);
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  return (
    <S.box>
      <S.LoginBox>
        <S.StyledPaper>
          <S.Form onSubmit={handleFormSubmit}>
            <S.h1>Autorizēties</S.h1>

            <S.textField
              label="E-pasts"
              variant="standard"
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleFormInputChange}
              required
              error={problem == 'wrong' && true}
              autoComplete="true"
            />

            <S.textField
              label="Parole"
              variant="standard"
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              name="password"
              value={formValues.password}
              onChange={handleFormInputChange}
              required
              error={problem == 'wrong' && true}
              autoComplete="true"
            />

            <S.button
              variant="contained"
              type="submit"
              color={problem == 'error' && !isPending ? 'error' : 'primary'}
              disabled={isPending}
            >
              {isPending ? <CircularProgress /> : <>Pievienoties</>}
            </S.button>

            <Button
              sx={{
                borderRadius: 50,
                mt: '1rem',
                maxWidth: 220,
                alignSelf: 'center',
              }}
              onClick={() => nav('/register')}
            >
              Nav konts? Reģistrējies
            </Button>
          </S.Form>
        </S.StyledPaper>
      </S.LoginBox>
    </S.box>
  );
};

export default Login;
