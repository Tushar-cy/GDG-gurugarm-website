import {
  Box,
  Container,
  SimpleGrid,
  VStack,
  Heading,
  Text,
  Icon,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { FaLaptopCode, FaUsers, FaGraduationCap, FaHandshake } from 'react-icons/fa';

const offerings = [
  {
    icon: FaLaptopCode,
    title: 'Technical Workshops',
    description: 'Hands-on workshops on the latest technologies and development practices.',
  },
  {
    icon: FaUsers,
    title: 'Community Events',
    description: 'Regular meetups, hackathons, and networking opportunities with fellow developers.',
  },
  {
    icon: FaGraduationCap,
    title: 'Learning Resources',
    description: 'Access to exclusive learning materials, codelabs, and study groups.',
  },
  {
    icon: FaHandshake,
    title: 'Mentorship',
    description: 'Connect with experienced developers and get guidance for your tech journey.',
  },
];

export default function WhatWeOffer() {
  return (
    <Box py={{ base: 12, md: 20 }} bg="white">
      <Container maxW="7xl">
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center" maxW="800px">
            <Heading
              fontSize={{ base: '3xl', md: '4xl' }}
              color="neutral.900"
              fontFamily="Google Sans Display"
              fontWeight="medium"
            >
              What We{' '}
              <Text as="span" color="primary.500">
                Offer
              </Text>
            </Heading>
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              color="neutral.700"
              fontFamily="Google Sans Text"
            >
              Join our community and get access to exclusive events, workshops, and networking
              opportunities.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full">
            {offerings.map((offering, index) => (
              <Card
                key={index}
                variant="elevated"
                _hover={{
                  transform: 'translateY(-4px)',
                  boxShadow: 'lg',
                }}
                transition="all 0.2s"
              >
                <CardBody>
                  <VStack spacing={4} align="flex-start">
                    <Icon
                      as={offering.icon}
                      boxSize={10}
                      color="primary.500"
                    />
                    <Heading
                      size="md"
                      color="neutral.900"
                      fontFamily="Google Sans"
                    >
                      {offering.title}
                    </Heading>
                    <Text
                      color="neutral.700"
                      fontFamily="Google Sans Text"
                    >
                      {offering.description}
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
} 