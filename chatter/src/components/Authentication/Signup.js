import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, Text, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from "react-router";

const SignUp = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pic, setPic] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    capitalLetter: false,
    number: false,
    specialCharacter: false,
    minLength: false,
  });
  const toast = useToast()

  const history = useNavigate()

  const handleClick = () => {
    setShow(!show)
  }

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    // Validate password constraints
    const containsCapitalLetter = /[A-Z]/.test(newPassword);
    const containsNumber = /[0-9]/.test(newPassword);
    const containsSpecialCharacter = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(newPassword);
    const isMinLength = newPassword.length >= 6;
    setPasswordValidation({
      capitalLetter: containsCapitalLetter,
      number: containsNumber,
      specialCharacter: containsSpecialCharacter,
      minLength: isMinLength,
    });
  };

  const postDetails = (pics) => {
    setLoading(true)
    if (pics === undefined) {
      toast({
        title: 'Plz upload an image',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
      return
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData()
      data.append("file", pics)
      data.append("upload_preset", "chat-app")
      data.append("cloud_name", "dujlzgyww")
      fetch("https://api.cloudinary.com/v1_1/dujlzgyww/image/upload", {
        method: 'post',
        body: data
      }).then((res) => res.json())
        .then(data => {
          setPic(data.url.toString())
          console.log(data.url.toString())
          setLoading(false)
        })
        .catch((err) => {
          console.log(err)
          setLoading(false)
        })
    }
    else {
      toast({
        title: 'plz select an image',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
      setLoading(false)
      return
    }
  }

  const handleSignup = async () => {
    if (!name || !email || !password || !cpassword) {
      toast({
        title: "Fill all Fields",
        status: "warning",
        duration: 6000,
        position: "bottom"
      })
      setLoading(false)
      return
    }

    if (cpassword !== password) {
      toast({
        title: "Passwords dont match",
        status: "warning",
        duration: 6000,
        position: "bottom"
      })
      setLoading(false)
      return
    }

    if (!passwordValidation.capitalLetter || !passwordValidation.number || !passwordValidation.specialCharacter || !passwordValidation.minLength) {
      toast({
        title: 'Password didn\'t meet the required constraints',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "bottom"
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json"
        }
      }

      const { data } = await axios.post(
        "/api/user",
        { name, email, password, pic },
        config
      )
      toast({
        title: "Registration succesfull",
        status: "success",
        duration: 6000,
        position: "bottom"

      })

      localStorage.setItem("userInfo", JSON.stringify(data))
      setLoading(false)
      history('/chats')
    }

    catch (err) {

      toast({
        title: "Error Occured!",
        description: err.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }

  }

  return (
    <VStack>

      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input type='text' isRequired onChange={(e) => setName(e.target.value)}></Input>
      </FormControl>

      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input type='text' isRequired onChange={(e) => setEmail(e.target.value)}></Input>
      </FormControl>

      <FormControl>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? 'text' : 'password'}
            isRequired
            value={password}
            onChange={handlePasswordChange}
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.5rem' size='sm' onClick={handleClick}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
        <Text color={passwordValidation.capitalLetter ? 'green' : 'red'}>Contains at least one capital letter</Text>
        <Text color={passwordValidation.number ? 'green' : 'red'}>Contains at least one number</Text>
        <Text color={passwordValidation.specialCharacter ? 'green' : 'red'}>
          Contains at least one special character
        </Text>
        <Text color={passwordValidation.minLength ? 'green' : 'red'}>Minimum length of 6 characters</Text>
      </FormControl>

      <FormControl>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input type={show ? "text" : "password"} isRequired onChange={(e) => setCpassword(e.target.value)}></Input>
          <InputRightElement width='4.5rem'>
            <Button h="1.5rem" w="2rem" onClick={handleClick}>
              show
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl>
        <FormControl>Upload Pic</FormControl>
        <Input type='file' p={1.5} accept='image/*' onChange={(e) => postDetails(e.target.files[0])}>
        </Input>
      </FormControl>

      <Button width='100%' colorScheme='blue' onClick={handleSignup} isLoading={loading}>
        SignUp
      </Button>

    </VStack>
  )
}

export default SignUp