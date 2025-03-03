import React from "react";
import { Box, Button, Typography, Grid } from "@mui/material";
import { GameSize } from "../types";

interface HomeProps {
  onGameSizeSelect: (size: GameSize) => void;
}

const Home: React.FC<HomeProps> = ({ onGameSizeSelect }) => {
  const sizes: GameSize[] = [4, 6, 8, 10];

  return (
    <Box sx={{ p: 3, textAlign: "center" }}>
      <Typography variant="h3" gutterBottom>
        Memory Game
      </Typography>
      <Typography variant="h5" gutterBottom>
        Select number of pairs:
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {sizes.map((size) => (
          <Grid item key={size}>
            <Button
              variant="contained"
              size="large"
              onClick={() => onGameSizeSelect(size)}
            >
              {size} Pairs
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home;
