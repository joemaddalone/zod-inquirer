# Project Brief: zod-inquirer

## Overview
A TypeScript library that bridges Zod schema validation with Inquirer.js prompts, enabling automatic prompt generation and validation from Zod schemas.

## Core Requirements

### Primary Goal
Create a seamless integration between Zod schemas and Inquirer.js that:
- Automatically generates appropriate prompts based on Zod schema types
- Validates user input against Zod schemas in real-time
- Provides retry logic for invalid inputs
- Supports common Zod types (string, enum, array of enums)

### Key Features
1. **Schema-Driven Prompts**: Dynamically generate prompts from Zod object schemas
2. **Type-Aware Prompting**: 
   - String fields → text input
   - Enum fields → select dropdown
   - Array of enums → checkbox multi-select
3. **Built-in Validation**: Use Zod's validation with user-friendly error messages
4. **Retry Logic**: Configurable max retries for invalid inputs
5. **TypeScript Support**: Full type safety and IntelliSense

### Technical Constraints
- Must work with Zod v3.22.4+
- Must work with @inquirer/prompts v8.2.0+
- Must support multiple module formats (ESM, CJS, IIFE)
- Must maintain zero runtime dependencies beyond Zod and Inquirer
- Must be fully typed with TypeScript

### Success Criteria
- Clean, minimal API (single main function)
- Comprehensive test coverage
- Works with common Zod schema patterns
- Clear error messages for validation failures
- Easy to integrate into existing projects

## Non-Goals
- Supporting all Zod types (focus on common use cases)
- Custom prompt styling/theming
- Complex conditional prompting logic
- Form builders or UI frameworks
