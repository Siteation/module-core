<?php

declare(strict_types=1);

namespace Commerce365\Core\Service\Request;

use Commerce365\Core\Model\MainConfig;
use Commerce365\Core\Service\Response\ProcessResponse;
use GuzzleHttp\Client;

class Post
{
    private ProcessResponse $processResponse;
    private MainConfig $mainConfig;

    /**
     * @param MainConfig $mainConfig
     * @param ProcessResponse $processResponse
     */
    public function __construct(
        MainConfig $mainConfig,
        ProcessResponse $processResponse
    ) {
        $this->processResponse = $processResponse;
        $this->mainConfig = $mainConfig;
    }

    public function execute($method, $postData = [], $apiUrl = null): array
    {
        $hubUrl = $apiUrl ?? $this->mainConfig->getHubUrl();
        $hubAppId = $this->mainConfig->getHubAppId();
        $hubSecretKey = $this->mainConfig->getHubSecretKey();
        if (!$hubAppId || !$hubUrl || !$hubSecretKey) {
            return [];
        }

        $hubUrl = rtrim($hubUrl, '/') . '/';

        $client = new Client([
            'base_uri' => $hubUrl . 'api/',
            'verify' => false,
            'allow_redirects' => true,
            'http_errors' => false,
            'headers' => [
                'Accept' => 'application/json',
                'appId' => $hubAppId,
                'secretKey' => $hubSecretKey
            ]
        ]);

        $response = $client->post($method, $postData);

        return $this->processResponse->execute($response);
    }
}
