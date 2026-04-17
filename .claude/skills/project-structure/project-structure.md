## Description
Provides the project structure and the naming conventions of the files within the project.

## Root Structure
```
app/lib                     # Contains the library, utility and helpers
app/ui/components/buttons   # Contains button components that can be shared
```

## File Naming Structure
```
Type	        Convention	                        Example
Component	    PascalCase	                        `UserCard.tsx`
Hook	        camelCase with `use` prefix	        `useUserData.ts`
Service	        camelCase with `.service` suffix	`user.service.ts`
Store	        camelCase with `.store` suffix	    `user.store.ts`
Types	        camelCase with `.types` suffix	    `user.types.ts`
Utility	        camelCase 	                        `formatDate.ts`
Constants	    camelCase 	                        `appConfig.ts`
Page	        lowercase (Next.JS convention)	    `page.tsx`

```