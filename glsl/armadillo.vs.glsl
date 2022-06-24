
uniform vec3 lightPosition;

uniform mat4 rotationMatrix;

out vec3 colour;

#define PELVIS_HEIGHT_UPPER 8.0

#define PELVIS_HEIGHT_LOWER 6.5

float alpha = 0.0;

float skinningZone;

mat4 transformMatrix;

vec3 fusedVec;


void main() {
    // HINT: Q1(d and e) You will need to change worldPos to make the Armadillo move.
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vec3 vertexNormal;

    // Transforming the light vector in a correct way.
    transformMatrix = inverse(transpose(rotationMatrix));

    skinningZone = PELVIS_HEIGHT_UPPER - PELVIS_HEIGHT_LOWER;

    if (worldPos.y > PELVIS_HEIGHT_UPPER) {

        worldPos = modelMatrix * rotationMatrix * vec4(position, 1.0);
        
        vertexNormal = normalize(normalMatrix * vec3(transformMatrix * vec4(normal, 0.0)));

    } else if (worldPos.y > PELVIS_HEIGHT_LOWER) {
        // Linear skinning
        alpha = (worldPos.y-PELVIS_HEIGHT_LOWER) / skinningZone;

        vec4 linearPos = alpha * rotationMatrix * vec4(position, 1.0) + (1.0-alpha) * vec4(position, 1.0);

        worldPos = modelMatrix * linearPos;

        // Mix function is suggested by a TA, which is linearly interpolates between two values by alpha

        fusedVec = mix(normalMatrix*normal, mat3(transformMatrix)*normal, alpha);

        // My original way also works!!!
        // vertexNormal = normalize(normalMatrix * alpha * vec3(transformMatrix * vec4(normal, 0.0)));

        vertexNormal = normalize(fusedVec);
    } else {
        vertexNormal = normalize(normalMatrix*normal);

    }


    vec3 lightDirection = normalize(vec3(viewMatrix*(vec4(lightPosition - worldPos.xyz, 0.0))));

    float vertexColour = dot(lightDirection, vertexNormal);
    colour = vec3(vertexColour);

    gl_Position = projectionMatrix * viewMatrix * worldPos;
    
}