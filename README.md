# Treatify Web3

Fully onchain version of Treatify, running on Ethereum.

## Installation

1. Run the development console.
    ```javascript
    truffle develop
    ```

2. Compile and migrate the smart contracts. Note inside the development console we don't preface commands with `truffle`.
    ```javascript
    compile
    migrate
    ```

3. In the `client` directory, we run the React app. Smart contract changes must be manually recompiled and migrated.
    ```javascript
    // in another terminal (i.e. not in the truffle develop prompt)
    cd client
    npm run dev
    ```

4. To run the tests.
    ```javascript
    // inside the development console.
    test

    // outside the development console..
    truffle test
    ```

5. To build the application for production, use the build script. A production build will be in the `client/build` folder.
    ```javascript
    // ensure you are inside the client directory when running this
    npm run build
    ```

## FAQ
