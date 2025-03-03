import React, { useState } from "react";
import { Box, Typography, Button, Grid, Card, CardContent, IconButton, CircularProgress } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import { WordImagePair } from "../types";
import PixabayAttribution from "./PixabayAttribution";
import { searchImages } from "../services/pixabayService";

interface ImageCardProps {
  pair: WordImagePair;
  onRefresh: (pairId: number, word: string) => void;
  isLoading: boolean;
}

const ImageCard: React.FC<ImageCardProps> = ({ pair, onRefresh, isLoading }) => {
  return (
    <Card>
      <Box sx={{ position: 'relative', height: '140px' }}>
        {isLoading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            backgroundColor: '#f5f5f5'
          }}>
            <CircularProgress />
          </Box>
        ) : (
          <img 
            src={pair.imageUrl}
            alt={pair.word}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        )}
        <IconButton
          onClick={() => onRefresh(pair.pairId, pair.word)}
          disabled={isLoading}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            },
          }}
        >
          <RefreshIcon />
        </IconButton>
      </Box>
      <CardContent>
        <Typography variant="h6">{pair.word}</Typography>
        {pair.imageCredit && <PixabayAttribution credit={pair.imageCredit} />}
      </CardContent>
    </Card>
  );
};

interface ImageReviewProps {
  pairs: WordImagePair[];
  onConfirm: () => void;
  onRegenerateImage: (pairId: number, newImageUrl: string, newCredit: { user: string; pageUrl: string }) => void;
}

const ImageReview: React.FC<ImageReviewProps> = ({ 
  pairs, 
  onConfirm,
  onRegenerateImage 
}) => {
  const [loadingStates, setLoadingStates] = useState<{ [key: number]: boolean }>({});

  const handleRefreshClick = async (pairId: number, word: string) => {
    console.log('=== Starting image refresh ===');
    console.log('Refresh button clicked for pair:', pairId, 'word:', word);
    setLoadingStates(prev => ({ ...prev, [pairId]: true }));

    try {
      const images = await searchImages(word);
      console.log('Received images:', images);
      
      if (images.length > 0) {
        const newImage = images[0];
        console.log('Selected new image:', newImage);
        console.log('New image URL:', newImage.webformatURL);
        
        if (!newImage.webformatURL) {
          console.error('No URL found in new image');
          return;
        }

        onRegenerateImage(
          pairId,
          newImage.webformatURL,
          {
            user: newImage.user,
            pageUrl: newImage.pageURL,
          }
        );
      } else {
        console.error('No images found for word:', word);
      }
    } catch (error) {
      console.error('Error fetching new image:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [pairId]: false }));
      console.log('=== End of image refresh ===');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Review Images
      </Typography>
      <Typography variant="body1" gutterBottom>
        These images will be used for your memory game. You can regenerate any image by clicking the refresh icon. Click Start Game when ready.
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {pairs.map((pair) => (
          <Grid item xs={12} sm={6} md={4} key={pair.pairId}>
            <ImageCard
              pair={pair}
              onRefresh={handleRefreshClick}
              isLoading={loadingStates[pair.pairId]}
            />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          onClick={onConfirm}
        >
          Start Game
        </Button>
      </Box>
    </Box>
  );
};

export default ImageReview;
