# ─────────────────────────────────────────────────────────────────
# Stage 1 — Build: compile & package the Spring Boot fat JAR
# ─────────────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Copy Maven wrapper and POM first (layer-cache dependencies)
COPY mvnw mvnw.cmd ./
COPY .mvn .mvn
COPY pom.xml ./

# Download dependencies (cached unless pom.xml changes)
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Copy source and build the JAR (skip tests for faster image builds)
COPY src ./src
RUN ./mvnw package -DskipTests -B

# ─────────────────────────────────────────────────────────────────
# Stage 2 — Runtime: slim JRE image with just the JAR
# ─────────────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine AS runtime

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

WORKDIR /app

# Copy only the built JAR from the builder stage
COPY --from=builder /app/target/Text-to-Learn-0.0.1-SNAPSHOT.jar app.jar

# Expose Spring Boot port
EXPOSE 8080

# Environment variables — override these at runtime via -e or docker-compose
# (dotenv-java will fall back to system env vars if no .env file is present)
ENV DB_URL=""
ENV DB_USERNAME=""
ENV DB_PASSWORD=""
ENV AI_API_KEY=""
ENV OPENROUTER_API_KEY=""
ENV YOUTUBE_API_KEY=""
ENV JWT_SECRET=""
ENV OPEN_ROUTER=""

# Health check — hits the /api/health endpoint every 30s
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget -qO- http://localhost:8080/api/health || exit 1

# JVM tuning for containers: respect cgroup memory limits
ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-jar", "app.jar"]
