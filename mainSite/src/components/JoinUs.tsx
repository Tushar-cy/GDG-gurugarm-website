import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Link,
  Icon,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaInstagram, FaTwitter, FaLinkedin, FaGlobe } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CommudelIcon = () => (
  <Image
    src="https://json.commudle.com/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBZzYzIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--ec4a1cbde1227bc84c1fc145325263b3dfb219e4/commudle-logo128.png"
    alt="Commudle"
    width="32px"
    height="32px"
    objectFit="contain"
  />
);

const JoinUs = () => {
  const navigate = useNavigate();
  const bgGradient = useColorModeValue(
    'linear(to-r, google.blue, google.red)',
    'linear(to-r, blue.600, red.600)'
  );

  const socials = [
    {
      name: 'X (Twitter)',
      icon: FaTwitter,
      url: 'https://x.com/gdg_ongug?s=11',
      color: 'gray.700'
    },
    {
      name: 'Instagram',
      icon: FaInstagram,
      url: 'https://www.instagram.com/gdg.gug/?__pwa=1',
      color: 'pink.500'
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedin,
      url: 'https://www.linkedin.com/company/gdg-on-campus-gurugram-university/',
      color: 'linkedin.500'
    },
    {
      name: 'Commudle',
      customIcon: CommudelIcon,
      url: 'https://www.commudle.com/users/gdggug24',
      color: '#4A148C' // Commudle's brand color
    },
    {
      name: 'Chapter Page',
      icon: FaGlobe,
      url: 'https://gdg.community.dev/gdg-on-campus-gurugram-university-gurugram-india/',
      color: 'blue.500'
    }
  ];

  return (
    <Box py={{ base: 16, md: 20 }} bg={useColorModeValue('gray.50', 'gray.900')}>
      <Container maxW="4xl">
        <VStack spacing={8} align="center" textAlign="center">
          <Heading
            as="h2"
            size="2xl"
            bgGradient={bgGradient}
            bgClip="text"
            fontWeight="bold"
          >
            Join Our Community
          </Heading>
          <Text fontSize="xl" color={useColorModeValue('gray.600', 'gray.400')}>
            Connect with us on social media and stay updated with our latest events and activities
          </Text>
          
          <Button
            size="lg"
            colorScheme="blue"
            onClick={() => navigate('/events')}
            mb={8}
          >
            View Events
          </Button>

          <HStack 
            spacing={{ base: 4, md: 6 }} 
            wrap="wrap" 
            justify="center"
            py={4}
          >
            {socials.map((social) => (
              <Link
                key={social.name}
                href={social.url}
                isExternal
                _hover={{ transform: 'translateY(-2px)' }}
                transition="all 0.3s"
              >
                <VStack spacing={2}>
                  {social.customIcon ? (
                    <Box boxSize={8}>
                      <social.customIcon />
                    </Box>
                  ) : (
                    <Icon
                      as={social.icon}
                      boxSize={8}
                      color={social.color}
                      _hover={{ color: typeof social.color === 'string' ? social.color : `${social.color}.600` }}
                    />
                  )}
                  <Text fontSize="sm" fontWeight="medium">
                    {social.name}
                  </Text>
                </VStack>
              </Link>
            ))}
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default JoinUs; 