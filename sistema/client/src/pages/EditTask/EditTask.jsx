import {
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  TextField,
} from '@mui/material';
import * as S from '../NewTask/style';
import { useEffect, useState } from 'react';
import axios from 'axios';
import url from '../../../url';
import { Check, Close } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { languages } from '../../languages';

const EditTask = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const fieldError =
    'Obligātam laukam ir jāsatur vismaz 1 simbolu, neskaitot atstarpes';
  const [data, setData] = useState(undefined);
  const [fieldValid, setFieldValid] = useState({
    topic: false,
    name: false,
    description: false,
    language: false,
    points: false,
  });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({
    pending: false,
    error: false,
    success: false,
  });

  const isWhitespaceString = (str) => !/\S/.test(str); // Checks if string only contains white space returns true/false

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let incompleteData = false;
    let tempObj = { ...fieldValid };

    for (const [key, value] of Object.entries(fieldValid)) {
      if (isWhitespaceString(data[key])) {
        tempObj[key] = true;
        incompleteData = true;
      } else {
        tempObj[key] = false;
      }
    }

    if (!incompleteData) {
      const postData = {
        tema: data.topic,
        nosaukums: data.name,
        apraksts: data.description,
        valoda: data.language,
        punkti: data.points,
        piemers: data.example,
      };
      setStatus({ ...status, pending: true, error: false });
      axios
        .patch(`${url}uzdevumi/${id}`, postData)
        .then(function (response) {
          if (response.data.message.includes('Updated entry')) {
            setStatus({
              ...status,
              pending: false,
              error: false,
              success: true,
            });
          }
          // man we really gotta do smth about dem pics
          setTimeout(() => nav('/admin/bank'), 500);
        })
        .catch(function (error) {
          setStatus({ ...status, pending: false, error: true });
          console.log(error);
        });
    }
    setFieldValid(tempObj);
  };

  useEffect(() => {
    if (data == undefined) {
      axios
        .get(`${url}uzdevumi/${id}`)
        .then(function (res) {
          let d = res.data[0];
          setData({
            topic: d.tema,
            name: d.nosaukums,
            description: d.apraksts,
            language: d.valoda,
            points: d.punkti,
            example: d.piemers,
          });
        })
        .catch(function (error) {
          setData('error');
          console.log(error.response.data);
        });
    }
  }, []);

  return (
    <Paper
      sx={{
        display: 'flex',
        width: 9000,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {data != undefined ? (
        <S.Form
          onSubmit={handleSubmit}
          sx={{
            width: '60%',
            height: '80%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <TextField
            error={fieldValid.topic}
            fullWidth
            required
            label="Tēma"
            name="topic"
            onChange={handleFormInputChange}
            value={data.topic}
            helperText={fieldValid.topic && fieldError}
          />
          <TextField
            error={fieldValid.name}
            required
            fullWidth
            label="Uzdevuma nosaukums"
            name="name"
            onChange={handleFormInputChange}
            value={data.name}
            helperText={fieldValid.name && fieldError}
          />
          <TextField
            error={fieldValid.description}
            required
            fullWidth
            label="Apraksts"
            name="description"
            onChange={handleFormInputChange}
            value={data.description}
            helperText={fieldValid.description && fieldError}
          />
          <TextField
            error={fieldValid.language}
            required
            fullWidth
            name="language"
            select
            label="Programmēšanas valoda"
            onChange={handleFormInputChange}
            value={data.language}
            helperText={
              fieldValid.language && 'Neaizpildīts obligātais lauciņš!'
            }
          >
            {languages.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            error={fieldValid.points}
            required
            fullWidth
            label="Punkti"
            name="points"
            type="number"
            value={data.points}
            onChange={handleFormInputChange}
          />
          <TextField
            fullWidth
            label="Piemērs"
            name="example"
            disabled={data.language == '' ? true : false}
            helperText={
              data.language == '' ? 'Izvēlaties programmēšanas valodu!' : false
            }
            value={data.example}
            onChange={handleFormInputChange}
          />
          <input
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
            type="file"
          />
          <Button
            color={
              status.error ? 'error' : status.success ? 'success' : 'primary'
            }
            disabled={status.pending ? true : false}
            variant={status.error || status.success ? 'contained' : 'outlined'}
            type="submit"
          >
            {status.pending ? (
              <CircularProgress size={24.5} />
            ) : status.success ? (
              <Check />
            ) : status.error ? (
              <Close />
            ) : (
              <>Mainīt</>
            )}
          </Button>
        </S.Form>
      ) : data == 'error' ? (
        <CircularProgress />
      ) : (
        data == undefined && <CircularProgress />
      )}
    </Paper>
  );
};

export default EditTask;