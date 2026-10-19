import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  VStack,
  Text,
  Image,
  HStack,
  IconButton,
  Link,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react';
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';
import { API_ENDPOINTS } from '../config/api';
import JoinUs from './JoinUs';

interface TeamMember {
  _id?: string;
  name: string;
  role: string;
  image: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
}

const Team = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const cardBg = useColorModeValue('white', 'gray.800');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        console.log('Fetching team members from:', API_ENDPOINTS.team);
        const response = await fetch(API_ENDPOINTS.team);
        
        if (!response.ok) {
          console.error('Team fetch failed with status:', response.status);
          throw new Error(`Failed to fetch team members: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Team data received:', data);
        setTeamMembers(data);
      } catch (err) {
        console.error('Error fetching team members:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        
        // Add fallback data for testing
        if (process.env.NODE_ENV !== 'production') {
          setTeamMembers([
            {
              _id: '1',
              name: 'Akhil Sharma',
              role: 'GDG Head',
              image: 'https://randomuser.me/api/portraits/men/1.jpg',
              linkedin: 'https://linkedin.com',
              github: 'https://github.com'
            },
            {
              _id: '2',
              name: 'Jane Doe',
              role: 'Tech Lead',
              image: 'https://randomuser.me/api/portraits/women/2.jpg',
              linkedin: 'https://linkedin.com',
              twitter: 'https://twitter.com'
            },
            {
              _id: '3',
              name: 'John Smith',
              role: 'Developer',
              image: 'https://randomuser.me/api/portraits/men/3.jpg',
              github: 'https://github.com'
            },
            {
              _id: '4',
              name: 'Emily Johnson',
              role: 'Designer',
              image: 'https://randomuser.me/api/portraits/women/4.jpg',
              linkedin: 'https://linkedin.com'
            }
          ]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  if (loading) {
    return (
      <Box as="section" bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW="8xl" py={{ base: 12, md: 16 }}>
          <VStack spacing={12} align="stretch">
            <Box textAlign="center">
              <Heading
                as="h2"
                size="2xl"
                fontWeight="bold"
                mb={4}
                bgGradient="linear(to-r, google.blue, google.red)"
                bgClip="text"
              >
                Our Team
              </Heading>
              <Text fontSize="xl" color={useColorModeValue('gray.600', 'gray.400')}>
                Loading team members...
              </Text>
            </Box>
          </VStack>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box as="section" bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW="8xl" py={{ base: 12, md: 16 }}>
          <VStack spacing={12} align="stretch">
            <Box textAlign="center">
              <Heading
                as="h2"
                size="2xl"
                fontWeight="bold"
                mb={4}
                bgGradient="linear(to-r, google.blue, google.red)"
                bgClip="text"
              >
                Our Team
              </Heading>
              <Text fontSize="xl" color="red.500">
                Error loading team members: {error}
              </Text>
            </Box>
          </VStack>
        </Container>
      </Box>
    );
  }
  
  return (
    <Box as="section" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Container maxW="8xl" py={{ base: 12, md: 16 }}>
        <VStack spacing={12} align="stretch">
          <Box textAlign="center">
            <Heading
              as="h2"
              size="2xl"
              fontWeight="bold"
              mb={4}
              bgGradient="linear(to-r, google.blue, google.red)"
              bgClip="text"
            >
              Our Team
            </Heading>
            <Text fontSize="xl" color={useColorModeValue('gray.600', 'gray.400')}>
              Meet the passionate individuals behind GDG Gurugram University
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4, xl: 5 }} spacing={8}>
            {teamMembers.map((member) => (
              <Box
                key={member._id}
                bg={cardBg}
                borderRadius="2xl"
                overflow="hidden"
                boxShadow="xl"
                transition="all 0.3s"
                _hover={{ transform: 'translateY(-8px)', shadow: '2xl' }}
                position="relative"
              >
                {/* Circular Image Container */}
                <Box
                  position="relative"
                  width="140px"
                  height="140px"
                  mx="auto"
                  mt={8}
                  mb={4}
                >
                  <Box
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    bottom="0"
                    borderRadius="full"
                    bg={member.role === 'GDG Head' ? 'purple.500' : member.role === 'Tech Lead' ? 'red.500' : 'blue.500'}
                    opacity="0.1"
                  />
                  <Image
                    src={member.image}
                    alt={member.name}
                    borderRadius="full"
                    objectFit="cover"
                    width="100%"
                    height="100%"
                    border="4px solid"
                    borderColor={member.role === 'GDG Head' ? 'purple.500' : member.role === 'Tech Lead' ? 'red.500' : 'blue.500'}
                  />
                </Box>

                <VStack p={6} spacing={3} align="center">
                  <Heading size="md" textAlign="center" fontWeight="bold">
                    {member.name}
                  </Heading>
                  <Text
                    color={member.role === 'GDG Head' ? 'purple.500' : member.role === 'Tech Lead' ? 'red.500' : 'blue.500'}
                    fontSize="sm"
                    fontWeight="semibold"
                    textTransform="uppercase"
                    letterSpacing="wide"
                  >
                    {member.role}
                  </Text>
                  <HStack spacing={4} pt={2}>
                    {member.linkedin && (
                      <Link href={member.linkedin} isExternal>
                        <IconButton
                          aria-label="LinkedIn"
                          icon={<FaLinkedin />}
                          colorScheme="linkedin"
                          variant="ghost"
                          size="sm"
                          rounded="full"
                        />
                      </Link>
                    )}
                    {member.twitter && (
                      <Link href={member.twitter} isExternal>
                        <IconButton
                          aria-label="Twitter"
                          icon={<FaTwitter />}
                          colorScheme="twitter"
                          variant="ghost"
                          size="sm"
                          rounded="full"
                        />
                      </Link>
                    )}
                    {member.github && (
                      <Link href={member.github} isExternal>
                        <IconButton
                          aria-label="GitHub"
                          icon={<FaGithub />}
                          colorScheme="gray"
                          variant="ghost"
                          size="sm"
                          rounded="full"
                        />
                      </Link>
                    )}
                  </HStack>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
      
      <Divider my={8} />
      
      {/* Join Us Section */}
      <JoinUs />
    </Box>
  );
};

export default Team; 