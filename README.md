# mcp-jira-git
A conversational developer assistant that automates the creation of Jira tasks and GitHub branches through natural language input.  

## Start the Application

1. **Start Docker**
   Ensure Docker is running on your computer.

2. **Launch the Containers**
   Navigate to the `mcp-jira-git` directory and run:
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```
3. **Access the Application**
   Open your browser and navigate to [http://localhost:3001](http://localhost:3001)

4. **Test backend**

   Open your browser and navigate to [http://localhost:8001/health](http://localhost:8001/health)
   it should return on screen browser

   ```
   {"status":"ok"}
   ```

   or do a CURL from terminal 

   ```
   curl -X GET http://localhost:8001/health
   ```

   should return same anwser in terminal

   ```
   {"status":"ok"}
   ```

## Shut down containers

Navigate to the `mcp-jira-git` directory and run:
   ```bash
   docker-compose -f docker-compose.yml down
   ```

