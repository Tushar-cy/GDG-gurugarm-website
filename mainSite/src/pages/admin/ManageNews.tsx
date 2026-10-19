import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Button,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  useToast,
  Image,
  Text,
  Grid,
  GridItem,
  Card,
  CardBody,
  Stack,
  Divider,
  Badge,
  Flex,
  Tooltip,
  useColorModeValue,
  ModalCloseButton,
  SimpleGrid,
  useDisclosure,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, CalendarIcon } from '@chakra-ui/icons';
import { API_ENDPOINTS } from '../../config/api';

interface NewsArticle {
  _id: string;
  title: string;
  content: string;
  image?: string;
  author: string;
  category: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

const categories = [
  'Design',
  'Sustainability',
  'Cultural Insights',
  'Market Tips',
  'Environmental Awareness',
  'Global Cuisine',
];

interface FormData {
  title: string;
  content: string;
  image: string;
  author: string;
  category: string;
  tags: string[];
}

const ManageNews = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const initialFormData: FormData = {
    title: '',
    content: '',
    image: '',
    author: '',
    category: '',
    tags: [],
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_ENDPOINTS.news);
      if (!response.ok) throw new Error('Failed to fetch articles');
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      toast({
        title: 'Error fetching articles',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    setFormData(prev => ({
      ...prev,
      tags,
    }));
  };

  const validateForm = () => {
    const errors: string[] = [];
    if (!formData.title.trim()) errors.push('Title is required');
    if (!formData.content.trim()) errors.push('Content is required');
    if (!formData.author.trim()) errors.push('Author name is required');
    if (!formData.category.trim()) errors.push('Category is required');
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      toast({
        title: 'Validation Error',
        description: errors.join('\n'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsLoading(true);
      const url = selectedArticle
        ? `${API_ENDPOINTS.news}/${selectedArticle._id}`
        : API_ENDPOINTS.news;

      const response = await fetch(url, {
        method: selectedArticle ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.length > 0 ? formData.tags : undefined,
          image: formData.image || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save article');
      }

      toast({
        title: `Article ${selectedArticle ? 'updated' : 'created'} successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onClose();
      fetchArticles();
      setFormData(initialFormData);
      setSelectedArticle(null);
    } catch (error) {
      toast({
        title: 'Error saving article',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (article: NewsArticle) => {
    setSelectedArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      image: article.image || '',
      author: article.author,
      category: article.category || '',
      tags: article.tags || [],
    });
    onOpen();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;

    try {
      setIsLoading(true);
      const response = await fetch(`${API_ENDPOINTS.news}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete article');

      toast({
        title: 'Article deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      fetchArticles();
    } catch (error) {
      toast({
        title: 'Error deleting article',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box bg={useColorModeValue('gray.50', 'gray.900')} minH="100vh" py={8}>
      <Container maxW="7xl">
        <VStack spacing={8} align="stretch">
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align="center"
            gap={4}
            bg={useColorModeValue('white', 'gray.800')}
            p={6}
            rounded="xl"
            shadow="sm"
          >
            <VStack align="start" spacing={1}>
              <Heading 
                size="lg" 
                bgGradient="linear(to-r, #4285F4, #0F9D58)" 
                bgClip="text"
              >
                News Management
              </Heading>
              <Text color="gray.500">Create and manage news articles for GDG Gug</Text>
            </VStack>
            <Button
              leftIcon={<AddIcon />}
              colorScheme="blue"
              size="lg"
              onClick={() => {
                setSelectedArticle(null);
                setFormData(initialFormData);
                onOpen();
              }}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}
              transition="all 0.2s"
            >
              Create Article
            </Button>
          </Flex>

          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
            gap={6}
          >
            {articles.map((article) => (
              <GridItem key={article._id}>
                <Card
                  bg={useColorModeValue('white', 'gray.800')}
                  overflow="hidden"
                  variant="outline"
                  _hover={{ shadow: 'lg' }}
                  transition="all 0.2s"
                >
                  <Image
                    src={article.image || 'https://via.placeholder.com/400x200?text=No+Image'}
                    alt={article.title}
                    height="200px"
                    objectFit="cover"
                  />
                  <CardBody>
                    <Stack spacing={4}>
                      <Flex justify="space-between" align="start">
                        <Heading size="md" noOfLines={2}>
                          {article.title}
                        </Heading>
                        <HStack>
                          <Tooltip label="Edit article">
                            <IconButton
                              aria-label="Edit article"
                              icon={<EditIcon />}
                              size="sm"
                              colorScheme="blue"
                              variant="ghost"
                              onClick={() => handleEdit(article)}
                            />
                          </Tooltip>
                          <Tooltip label="Delete article">
                            <IconButton
                              aria-label="Delete article"
                              icon={<DeleteIcon />}
                              size="sm"
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => handleDelete(article._id)}
                            />
                          </Tooltip>
                        </HStack>
                      </Flex>

                      <Text noOfLines={3} color="gray.500">
                        {article.content}
                      </Text>

                      <Divider />

                      <Stack spacing={2}>
                        <Flex align="center" justify="space-between">
                          <Text fontSize="sm" color="gray.500">
                            By {article.author}
                          </Text>
                          <HStack>
                            <CalendarIcon color="gray.500" />
                            <Text fontSize="sm" color="gray.500">
                              {new Date(article.createdAt).toLocaleDateString()}
                            </Text>
                          </HStack>
                        </Flex>

                        <Flex gap={2} flexWrap="wrap">
                          <Badge colorScheme="blue">
                            {article.category}
                          </Badge>
                          {article.tags?.map((tag) => (
                            <Badge key={tag} colorScheme="green">
                              {tag}
                            </Badge>
                          ))}
                        </Flex>
                      </Stack>
                    </Stack>
                  </CardBody>
                </Card>
              </GridItem>
            ))}
          </Grid>

          <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            size="xl"
            motionPreset="slideInBottom"
          >
            <ModalOverlay backdropFilter="blur(4px)" />
            <ModalContent bg={useColorModeValue('white', 'gray.800')}>
              <ModalHeader
                bgGradient="linear(to-r, #4285F4, #0F9D58)"
                bgClip="text"
                pb={2}
              >
                {selectedArticle ? 'Edit Article' : 'Create New Article'}
              </ModalHeader>
              <ModalBody>
                <VStack spacing={6}>
                  <FormControl isRequired>
                    <FormLabel>Title</FormLabel>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter a compelling title"
                      size="lg"
                      variant="filled"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Content</FormLabel>
                    <Textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder="Write your article content here..."
                      size="lg"
                      variant="filled"
                      rows={8}
                    />
                  </FormControl>

                  <Grid templateColumns="repeat(2, 1fr)" gap={4} width="100%">
                    <GridItem>
                      <FormControl isRequired>
                        <FormLabel>Author</FormLabel>
                        <Input
                          name="author"
                          value={formData.author}
                          onChange={handleInputChange}
                          placeholder="Author name"
                          variant="filled"
                        />
                      </FormControl>
                    </GridItem>
                    <GridItem>
                      <FormControl isRequired>
                        <FormLabel>Category</FormLabel>
                        <Select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          variant="filled"
                        >
                          <option value="">Select category</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                    </GridItem>
                  </Grid>

                  <FormControl>
                    <FormLabel>Image URL</FormLabel>
                    <Input
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="Enter image URL"
                      variant="filled"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Tags</FormLabel>
                    <Input
                      name="tags"
                      value={formData.tags.join(', ')}
                      onChange={handleTagsChange}
                      placeholder="Enter tags separated by commas"
                      variant="filled"
                    />
                  </FormControl>
                </VStack>
              </ModalBody>

              <ModalFooter gap={3}>
                <Button 
                  variant="ghost" 
                  onClick={onClose}
                  _hover={{ bg: 'gray.100' }}
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={handleSubmit}
                  isLoading={isLoading}
                  loadingText={selectedArticle ? 'Updating...' : 'Creating...'}
                  _hover={{
                    transform: 'translateY(-1px)',
                    boxShadow: 'md',
                  }}
                >
                  {selectedArticle ? 'Update Article' : 'Create Article'}
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </VStack>
      </Container>
    </Box>
  );
};

export default ManageNews; 