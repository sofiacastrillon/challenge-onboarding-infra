# CDK Infrastructure Skeleton for Microservices

## 📌 Introduction

This project serves as a standardized infrastructure-as-code (IaC) skeleton for microservices using AWS CDK with TypeScript. It provides a consistent and reusable foundation for deploying cloud resources across our SaaS platform's microservices architecture.

The skeleton includes pre-configured stacks for common AWS services:

- Amazon DynamoDB tables with standardized configurations
- Amazon SNS topics for event publishing
- Amazon SQS queues for message processing
- Amazon S3 buckets for object storage
- Amazon RDS (MySQL) for relational data

Key benefits:

- Accelerates infrastructure deployment for new microservices
- Enforces organizational best practices and standards
- Provides type-safe infrastructure definitions
- Enables consistent resource naming and tagging across environments

## ⚙️ Getting Started

### Prerequisites

- Node.js (v24 or later, see `.nvmrc` for exact version)
- AWS CDK CLI (v2.236.0 or compatible)
- AWS CLI configured with appropriate credentials
- TypeScript knowledge
- Access to target AWS account(s)

### Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
# Create a .env file with:
STAGE=development                    # or testing/production
AWS_ACCOUNT_ID=123456789012 # your AWS account ID
AWS_REGION=us-east-1        # your target region
```

### Useful Commands

- `npm run build` - Compile TypeScript code
- `npm run watch` - Watch for changes and compile
- `npm run test` - Run the test suite
- `npm run synth` - Synthesize CloudFormation template
- `npm run diff` - Compare deployed stack with current state
- `cdk deploy` - Deploy this stack to your default AWS account/region

## 🧱 Project Structure

```
.
├── stacks/                 # AWS resource stacks by service
│   ├── dynamo/            # DynamoDB table definitions
│   ├── sns/               # SNS topics and subscriptions
│   ├── sqs/              # SQS queues and configurations
│   ├── s3/               # S3 bucket definitions
│   ├── mysql/            # RDS MySQL configurations
│   └── InfrastructureStack.ts  # Main stack composition
├── interfaces/           # TypeScript interfaces
├── utils/               # Shared utilities
└── index.ts             # CDK app entry point
```

### Key Components

- `InfrastructureStack.ts`: Main stack that composes all resources
- `interfaces/`: Type definitions for stack props and resources
- `stacks/<service>/`: Service-specific resource definitions
- `utils/`: Helper functions for CDK configurations

## ✅ Best Practices and Guidelines

### Project and Stack Naming Convention

The project uses two key constants for naming and organization (`index.ts`):

```typescript
// Matches the backend project name for easy tracking and relationship
export const PROJECT_NAME = 'cdk-example';

// Different from PROJECT_NAME to avoid stack name collisions
export const STACK_NAME = 'cdk-example-infra';
```

#### Naming Rules

- Use kebab-case for resource names

1. **PROJECT_NAME**:

   - Must match exactly with the associated backend project name
   - Used for resource grouping and relationship tracking
   - Helps maintain clear connection between infrastructure and backend code
   - Example: If backend is `user-service`, use `user-service` as PROJECT_NAME

2. **STACK_NAME**:
   - Must be different from PROJECT_NAME
   - Should include a suffix like `-infra` or `-infrastructure`
   - Prevents naming collisions with backend stacks
   - Example: If PROJECT_NAME is `user-service`, use `user-service-infra`

### Resource Tagging

- Always include:
  - `Project`: Name of the project to which the infrastructure belongs (required).
  - `ProjectName`: Optional field kept for backward compatibility with cost explorer historical data.
  - `Repository`: URL of the repository containing the infrastructure code (required).
  - `Environment`: The environment to which the resource belongs (development, testing, or production).
  - `Owner`: Name of the delivery person or person in charge of the resource. Validate the owner name at https://opsless.alegra.com/.
  - `IsCritical`: Boolean string (`'true'` or `'false'`) indicating if the resource is critical for Alegra's operation.
  - `IsTemporal`: Boolean string (`'true'` or `'false'`) indicating if the resource is temporary.

### Environment Separation

- Use separate AWS accounts per environment when possible
- Environment-specific configurations via `STAGE` variable
- Allowed stage values: `development`, `testing`, `production`
- Different retention policies per environment:
  - Development: Resources can be destroyed
  - Testing/Production: Resources are retained

### Code Organization

- One file per resource type
- Group related resources in directories
- Use interfaces for type safety
- Keep resource definitions modular and reusable

### Security Best Practices

- No hardcoded credentials or ARNs
- Use environment variables for configuration
- Enable encryption by default
- Follow least privilege principle
- Enable point-in-time recovery for production databases

## 🔄 Extensibility and Maintenance

### Adding New Resources

1. Create a new file in appropriate service directory
2. Define resource class with static `build` method
3. Add resource interface in `interfaces/`
4. Import and integrate in `InfrastructureStack.ts`

Example:

```typescript
// stacks/dynamo/NewTable.ts
export class NewTable {
  static build(props: IStackBasicProps): ITable {
    return new Table(props.scope, `new-table-${props.stage}`, {
      // ... configuration
    });
  }
}
```

### Reusing Constructs

- Create reusable patterns in separate classes
- Use composition over inheritance
- Share common configurations via utilities
- Document construct interfaces

## 🤖 AI Support

This codebase is designed to be AI-friendly through:

### Structure Recognition

- Consistent file naming and organization
- Clear interface definitions
- Standardized build patterns
- Type-safe resource definitions

### Pattern Detection

AIs can identify:

- Resource naming conventions
- Environment-specific configurations
- Security patterns
- Resource relationships

### Automated Assistance

AIs can help with:

- Generating new resource definitions
- Validating against best practices
- Suggesting security improvements
- Identifying configuration issues

### Code Generation Guidelines

When using AI to generate new resources:

1. Follow existing patterns in similar resources
2. Include all required interfaces
3. Maintain consistent naming conventions
4. Add appropriate environment controls
5. Include standard tags and security settings

## Contributing

1. Follow the established project structure
2. Maintain type safety with interfaces
3. Document significant changes
4. Test in development first
5. Update this README as needed

## License

This project is internal to our organization and not licensed for external use.
