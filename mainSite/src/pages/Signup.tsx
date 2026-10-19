import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  InputGroup,
  Link,
  HStack,
  Image,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(email, password);
      toast({
        title: 'Welcome back!',
        description: 'Successfully signed in to your account.',
        status: 'success',
        duration: 3000,
        position: 'top',
        isClosable: true,
      });
      navigate('/admin');
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'Please check your credentials and try again.';

      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection.';
      }

      toast({
        title: 'Unable to sign in',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        position: 'top',
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      bg="#f9f9f9"
      display="flex"
      alignItems="center"
      justifyContent="center"
      py={10}
    >
      <Container maxW="700px" style={{ background: 'white', padding: '20px', borderRadius: '20px' }}>
        <Card
          variant="outline"
          borderRadius="lg"
          borderColor="neutral.200"
          boxShadow="sm"
        >
          <CardBody p={8} py={20}>
            <form onSubmit={handleSubmit}>
              <VStack spacing={0} align="stretch">
                {/* Logo and Title */}
                <Container>
                  <Image
                    src="/images/t2k7QK3r_400x400.png"
                    alt="GDG Logo"
                    boxSize="60px"
                    objectFit="contain"
                  />
                  <Text
                    fontSize="26px"
                    fontWeight="bold"
                    color="neutral.900"
                    fontFamily="Google Sans"
                    textAlign="left"
                    style={{ margin: '4px 0' }}
                  >
                    Sign up
                  </Text>
                  <Text
                    fontSize="16px"
                    color="#8f8f8f"
                    fontFamily="Google Sans Text"
                    textAlign="left"
                    style={{ margin: '8px 0 12px 0' }}
                  >
                    create your account in easy steps
                  </Text>
                </Container>

                {/* Form */}
                <VStack spacing={4} pt={4}>
                  <FormControl isRequired style={{ width: '100%' }}>
                    <FormLabel
                      fontSize="sm"
                      color="neutral.700"
                      fontFamily="Google Sans Text"
                      mb={1}
                    >
                      Email
                    </FormLabel>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      size="lg"
                      borderRadius="md"
                      borderColor="neutral.300"
                      color="neutral.900"
                      _placeholder={{ color: 'neutral.500' }}
                      _hover={{ borderColor: 'neutral.400' }}
                      _focus={{
                        borderColor: 'primary.500',
                        boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
                      }}
                      fontFamily="Roboto"
                      style={{
                        outline: 'none',
                        border: 'none',
                        background: '#f9f9f9',
                        width: '100%',
                        padding: '10px'
                      }}
                    />
                  </FormControl>

                  <FormControl isRequired style={{ width: '100%', marginTop: '10px' }}>
                    <FormLabel
                      fontSize="sm"
                      color="neutral.700"
                      fontFamily="Google Sans Text"
                      mb={1}
                    >
                      Password
                    </FormLabel>
                    <InputGroup size="lg" style={{ width: '100%' }}>
                      <Input
                        type={'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        borderRadius="md"
                        borderColor="neutral.300"
                        color="neutral.900"
                        _placeholder={{ color: 'neutral.500' }}
                        _hover={{ borderColor: 'neutral.400' }}
                        _focus={{
                          borderColor: 'primary.500',
                          boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
                        }}
                        fontFamily="Roboto"
                        style={{
                          outline: 'none',
                          border: 'none',
                          background: '#f9f9f9',
                          width: '100%',
                          padding: '10px'
                        }}
                      />
                    </InputGroup>
                  </FormControl>
                </VStack>

                {/* Links and Buttons */}
                <VStack spacing={6} pt={4} width={'full'} style={{ width: '100%' }}>
                  <Link
                    color="primary.500"
                    fontSize="14px"
                    fontWeight="500"
                    fontFamily="Google Sans"
                    alignSelf="flex-start"
                    _hover={{ textDecoration: 'none', color: 'primary.600' }}
                  >
                    Forgot password?
                  </Link>

                  <Text
                    color="neutral.700"
                    fontSize="14px"
                    fontFamily="Google Sans Text"
                  >
                    Not your computer? Use Guest mode to sign in privately.{' '}
                    <Link
                      color="primary.500"
                      fontWeight="500"
                      _hover={{ textDecoration: 'none', color: 'primary.600' }}
                    >
                      Learn more
                    </Link>
                  </Text>

                  <HStack justify="space-between" w="full" pt={4} style={{ width: '100%' }}>
                    <Link
                      color="primary.500"
                      fontSize="14px"
                      fontWeight="500"
                      fontFamily="Google Sans"
                      _hover={{ textDecoration: 'none', color: 'primary.600' }}
                      onClick={() => { navigate('/login') }}
                    >
                      Already have an account?
                    </Link>
                    <Button
                      type="submit"
                      colorScheme="primary"
                      size="lg"
                      px={20}
                      fontFamily="Google Sans"
                      fontWeight="500"
                      isLoading={loading}
                      _hover={{
                        transform: 'translateY(-1px)',
                        boxShadow: 'sm',
                      }}
                    >
                      Continue
                    </Button>
                  </HStack>
                </VStack>
              </VStack>
            </form>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
} 