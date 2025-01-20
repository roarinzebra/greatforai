# PowerShell Guide for Directory and File Management

This guide outlines best practices for managing directories and files in PowerShell within the project.

## Directory Navigation

Always use `Set-Location` to change directories before performing operations:

```powershell
# Change to workspace root
Set-Location -Path "C:/Users/username/path/to/workspace"

# Change to specific package
Set-Location -Path "packages/ui"
```

## Creating Directories

Use `New-Item` with `-Force` flag to create directories:

```powershell
# Create single directory
New-Item -Path "packages/new-package" -ItemType Directory -Force

# Create nested directories
New-Item -Path "packages/new-package/src/components" -ItemType Directory -Force

# Create multiple directories
"components", "hooks", "utils" | ForEach-Object {
    New-Item -Path "packages/ui/src/$_" -ItemType Directory -Force
}
```

## Creating Files

Use `New-Item` with `-Force` flag to create files:

```powershell
# Create empty file
New-Item -Path "packages/ui/src/index.ts" -ItemType File -Force

# Create file with content
New-Item -Path "README.md" -ItemType File -Force -Value "# Project Name`n`nProject description here."
```

## Path Conventions

1. Always use forward slashes (`/`) in paths for consistency
2. Use relative paths when in the correct directory
3. Use full paths when needed for clarity or when in a different directory

```powershell
# Good - Using forward slashes
New-Item -Path "packages/ui/src/components" -ItemType Directory -Force

# Good - Using full path when needed
New-Item -Path "C:/Users/username/projects/myapp/config" -ItemType Directory -Force

# Bad - Using backslashes
New-Item -Path "packages\ui\src\components" -ItemType Directory -Force
```

## Common Operations

### Creating Package Structure

```powershell
# Set location to workspace root
Set-Location -Path "C:/Users/username/projects/myapp"

# Create package with standard structure
$packageName = "new-package"
$directories = @(
    "src/components",
    "src/hooks",
    "src/utils",
    "src/types",
    "tests",
    "docs"
)

$directories | ForEach-Object {
    New-Item -Path "packages/$packageName/$_" -ItemType Directory -Force
}
```

### Creating Component Structure

```powershell
# Set location to package
Set-Location -Path "packages/ui"

# Create component with related files
$componentName = "Button"
$files = @(
    "src/components/$componentName/$componentName.tsx",
    "src/components/$componentName/$componentName.test.tsx",
    "src/components/$componentName/index.ts"
)

$files | ForEach-Object {
    New-Item -Path $_ -ItemType File -Force
}
```

## Best Practices

1. Always verify current location before operations:
   ```powershell
   Get-Location
   ```

2. Use variables for repeated values:
   ```powershell
   $srcPath = "packages/ui/src"
   New-Item -Path "$srcPath/components" -ItemType Directory -Force
   New-Item -Path "$srcPath/hooks" -ItemType Directory -Force
   ```

3. Create parent directories when needed:
   ```powershell
   New-Item -Path "deeply/nested/directory" -ItemType Directory -Force
   ```

4. Clean up temporary locations:
   ```powershell
   # Save original location
   $originalLocation = Get-Location
   
   # Do work in different location
   Set-Location -Path "some/other/path"
   
   # Return to original location
   Set-Location -Path $originalLocation
   ```

## Error Handling

When creating directories or files, check for success:

```powershell
try {
    New-Item -Path "packages/new-package" -ItemType Directory -Force -ErrorAction Stop
    Write-Host "Directory created successfully"
} catch {
    Write-Error "Failed to create directory: $_"
}
```

## Removing Items

Use `Remove-Item` with caution and always verify paths:

```powershell
# Remove single item
Remove-Item -Path "packages/old-package" -Force

# Remove directory and contents
Remove-Item -Path "packages/old-package" -Recurse -Force
``` 