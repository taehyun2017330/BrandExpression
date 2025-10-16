import { Box, Container, Typography } from "@mui/material";
import { BodyContainer } from "../ui/BodyContainer";

export default function Footer() {
  return (
    <footer>
      <Container
        maxWidth={false}
        sx={{
          py: { xs: "12px", md: "18px" },
          backgroundColor: "#FFF",
          borderTop: "1px solid #E1E1E1",
        }}
      >
        <BodyContainer>
          <Box sx={{ width: "100%", overflow: "auto" }}>
            <Typography sx={{ textAlign: "center", fontSize: '11px !important', color: '#bbb !important' }}>
              Research Prototype - University of Maryland & KAIST
            </Typography>
          </Box>
        </BodyContainer>
      </Container>
    </footer>
  );
}
